#!/usr/bin/env python3
"""Render a standard GemDuel card from the shared art layout JSON."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Any, Mapping

from PIL import Image, ImageChops, ImageDraw


REPO_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_LAYOUT = REPO_ROOT / "assets/card/layouts/standard-basic.json"
DEFAULT_OUTPUT = REPO_ROOT / "artifacts/card-renders/standard-basic-243-wh.png"
DEFAULT_BATCH_OUTPUT_DIR = REPO_ROOT / "artifacts/card-renders/all"
RESAMPLE = Image.Resampling.LANCZOS
GEM_ORDER = ("red", "green", "blue", "white", "black", "pearl", "gold")
RENDER_COLOR_FALLBACK = "white"
NULL_BONUS_RENDER_COLOR = "silver"
JOKER_TOP_CLOTH_COLOR = "pearl"
JOKER_POINT_RIBBON_COLOR = "gold"
JOKER_BONUS_BADGE_COLOR = "joker"
MAX_COST_TOKENS = 4
REAL_CARD_FILES = {
    "level1": REPO_ROOT / "packages/shared/src/data/realCardsLevel1.ts",
    "level2": REPO_ROOT / "packages/shared/src/data/realCardsLevel2.ts",
    "level3": REPO_ROOT / "packages/shared/src/data/realCardsLevel3.ts",
    "rogue": REPO_ROOT / "packages/shared/src/data/realCardsRogue.ts",
}
ABILITY_CONSTANTS = {
    "AGAIN": "again",
    "STEAL": "steal",
    "SCROLL": "scroll",
    "BONUS_GEM": "bonus_gem",
    "NONE": "none",
}


def read_json(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def resolve_asset(relative_path: str) -> Path:
    path = REPO_ROOT / relative_path
    if not path.exists():
        raise FileNotFoundError(f"Missing asset: {path}")
    return path


def open_rgba(path: Path) -> Image.Image:
    return Image.open(path).convert("RGBA")


def alignment_offset(outer: int, inner: int, align: str) -> int:
    if align in ("left", "top", "start"):
        return 0
    if align in ("right", "bottom", "end"):
        return outer - inner
    return (outer - inner) // 2


def fit_image(
    image: Image.Image,
    width: int,
    height: int,
    align_x: str = "center",
    align_y: str = "center",
) -> Image.Image:
    scale = min(width / image.width, height / image.height)
    resized = image.resize((round(image.width * scale), round(image.height * scale)), RESAMPLE)
    result = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    result.alpha_composite(
        resized,
        (
            alignment_offset(width, resized.width, align_x),
            alignment_offset(height, resized.height, align_y),
        ),
    )
    return result


def fill_image(image: Image.Image, width: int, height: int) -> Image.Image:
    scale = max(width / image.width, height / image.height)
    resized = image.resize((round(image.width * scale), round(image.height * scale)), RESAMPLE)
    left = max(0, (resized.width - width) // 2)
    top = max(0, (resized.height - height) // 2)
    return resized.crop((left, top, left + width, top + height))


def fit_or_fill(
    image: Image.Image,
    width: int,
    height: int,
    scale_mode: str,
    align_x: str = "center",
    align_y: str = "center",
) -> Image.Image:
    if scale_mode.lower() == "fill":
        return fill_image(image, width, height)
    return fit_image(image, width, height, align_x, align_y)


def paste_alpha(base: Image.Image, overlay: Image.Image, x: int, y: int) -> None:
    src_x = max(0, -x)
    src_y = max(0, -y)
    dst_x = max(0, x)
    dst_y = max(0, y)
    width = min(overlay.width - src_x, base.width - dst_x)
    height = min(overlay.height - src_y, base.height - dst_y)
    if width <= 0 or height <= 0:
        return
    cropped = overlay.crop((src_x, src_y, src_x + width, src_y + height))
    base.alpha_composite(cropped, (dst_x, dst_y))


def template_path(paths: Mapping[str, Any], key: str, variant: str | None = None, **values: Any) -> Path:
    template = paths[key]
    if isinstance(template, dict):
        if not variant:
            raise ValueError(f"Asset path '{key}' requires a variant.")
        if variant not in template:
            raise ValueError(f"Asset path '{key}' has no variant '{variant}'.")
        template = template[variant]
    return resolve_asset(str(template).format(**values))


def paste_asset(
    canvas: Image.Image,
    paths: Mapping[str, Any],
    key: str,
    box: Mapping[str, Any],
    variant: str | None = None,
    **values: Any,
) -> None:
    image = open_rgba(template_path(paths, key, variant=variant, **values))
    width = int(box["w"])
    height = int(box["h"])
    scale_mode = str(box.get("scaleMode", "fit"))
    rendered = fit_or_fill(
        image,
        width,
        height,
        scale_mode,
        str(box.get("alignX", "center")),
        str(box.get("alignY", "center")),
    )
    paste_alpha(canvas, rendered, int(box["x"]), int(box["y"]))


def paste_specific_asset(canvas: Image.Image, relative_path: str, box: Mapping[str, Any]) -> None:
    image = open_rgba(resolve_asset(relative_path))
    width = int(box["w"])
    height = int(box["h"])
    scale_mode = str(box.get("scaleMode", "fit"))
    rendered = fit_or_fill(
        image,
        width,
        height,
        scale_mode,
        str(box.get("alignX", "center")),
        str(box.get("alignY", "center")),
    )
    paste_alpha(canvas, rendered, int(box["x"]), int(box["y"]))


def color_override_path(paths: Mapping[str, Any], key: str, color: str) -> str | None:
    overrides = paths.get(key, {})
    if not isinstance(overrides, Mapping):
        return None
    value = overrides.get(color)
    return str(value) if value else None


def number_image(paths: Mapping[str, Any], value: Any, size: int) -> Image.Image:
    digits = [char for char in str(value) if char.isdigit()]
    if not digits:
        raise ValueError(f"Card number value has no digits: {value!r}")

    advance = round(size * 0.58)
    width = size if len(digits) == 1 else size + advance * (len(digits) - 1)
    result = Image.new("RGBA", (width, size), (0, 0, 0, 0))

    for index, digit in enumerate(digits):
        image = open_rgba(template_path(paths, "cardNumber", digit=digit))
        rendered = fit_image(image, size, size)
        result.alpha_composite(rendered, (index * advance, 0))

    return result


def paste_number_centered(
    canvas: Image.Image,
    paths: Mapping[str, Any],
    value: Any,
    center_x: float,
    center_y: float,
    size: int,
) -> None:
    rendered = number_image(paths, value, size)
    x = round(center_x - rendered.width / 2)
    y = round(center_y - rendered.height / 2)
    paste_alpha(canvas, rendered, x, y)


def paste_gem_centered(
    canvas: Image.Image,
    paths: Mapping[str, Any],
    color: str,
    center_x: float,
    center_y: float,
    size: int,
) -> None:
    image = open_rgba(template_path(paths, "gem", color=color))
    rendered = fit_image(image, size, size)
    paste_alpha(canvas, rendered, round(center_x - size / 2), round(center_y - size / 2))


def paste_bonus_gem_badge(
    canvas: Image.Image,
    paths: Mapping[str, Any],
    color: str,
    badge: Mapping[str, Any],
) -> None:
    override = color_override_path(paths, "bonusGemBadgeOverrides", color)
    if override:
        paste_specific_asset(canvas, override, badge)
        return
    paste_asset(canvas, paths, "bonusGemBadge", badge, color=color)


def paste_bonus_gem_symbol_centered(
    canvas: Image.Image,
    paths: Mapping[str, Any],
    color: str,
    center_x: float,
    center_y: float,
    size: int,
) -> None:
    override = color_override_path(paths, "bonusGemSymbolOverrides", color)
    image = open_rgba(resolve_asset(override)) if override else open_rgba(template_path(paths, "gem", color=color))
    rendered = fit_image(image, size, size)
    paste_alpha(canvas, rendered, round(center_x - size / 2), round(center_y - size / 2))


def paste_badge_gem_centered(
    canvas: Image.Image,
    paths: Mapping[str, Any],
    color: str,
    badge: Mapping[str, Any],
) -> None:
    integrated_badge_colors = paths.get("integratedBonusGemBadgeColors", [])
    if color in integrated_badge_colors:
        return
    adjustments = badge.get("gemColorAdjustments", {})
    adjustment = adjustments.get(color, {}) if isinstance(adjustments, Mapping) else {}
    scale = float(adjustment.get("scale", 1)) if isinstance(adjustment, Mapping) else 1
    offset_x = float(adjustment.get("offsetX", 0)) if isinstance(adjustment, Mapping) else 0
    offset_y = float(adjustment.get("offsetY", 0)) if isinstance(adjustment, Mapping) else 0
    size = round(int(badge["gemSize"]) * scale)
    paste_bonus_gem_symbol_centered(
        canvas,
        paths,
        color,
        float(badge["gemCenterX"]) + offset_x,
        float(badge["gemCenterY"]) + offset_y,
        size,
    )


def crown_path(paths: Mapping[str, Any], crowns: Any) -> str | None:
    try:
        count = int(crowns)
    except (TypeError, ValueError):
        return None
    if count <= 0:
        return None
    return paths["crownBadges"].get(str(min(count, 3)))


def crown_layer(layers: Mapping[str, Any], crowns: Any) -> Mapping[str, Any] | None:
    try:
        count = int(crowns)
    except (TypeError, ValueError):
        return None
    if count <= 0:
        return None

    crown_layers = layers.get("crownBadges")
    crown_key = str(min(count, 3))
    if isinstance(crown_layers, Mapping) and crown_key in crown_layers:
        layer = crown_layers[crown_key]
        if isinstance(layer, Mapping):
            return layer

    fallback = layers.get("crownBadge")
    return fallback if isinstance(fallback, Mapping) else None


def ability_path(paths: Mapping[str, Any], ability: str) -> str | None:
    if not ability or ability == "none":
        return None
    return paths["abilityMedallions"].get(ability)


def active_abilities(card: Mapping[str, Any]) -> list[str]:
    abilities = card.get("abilities", [])
    if isinstance(abilities, str):
        abilities = [abilities]
    return [str(ability) for ability in abilities if ability and str(ability) != "none"]


def point_ribbon_variant(card: Mapping[str, Any]) -> str:
    ability_count = len(active_abilities(card))
    if ability_count == 0:
        return "short"
    if ability_count == 1:
        return "medium"
    return "long"


def point_value_offset_y(point_value: Mapping[str, Any], ability_count: int) -> float:
    if ability_count == 0:
        return float(point_value.get("noAbilityOffsetY", 0))
    if ability_count == 1:
        return float(point_value.get("oneAbilityOffsetY", 0))
    return 0


def parse_required(pattern: str, text: str, field: str, source: Path) -> str:
    match = re.search(pattern, text, flags=re.S)
    if not match:
        raise ValueError(f"Missing {field} in {source}.")
    return match.group(1)


def parse_optional_int(pattern: str, text: str, default: int) -> int:
    match = re.search(pattern, text, flags=re.S)
    return int(match.group(1)) if match else default


def parse_ability(block: str) -> list[str]:
    if "ability:" not in block:
        return []

    array_match = re.search(r"ability:\s*\[([^\]]*)\]", block, flags=re.S)
    if array_match:
        source = array_match.group(1)
    else:
        source = parse_required(r"ability:\s*([^,\n]+)", block, "ability", Path("<card>"))

    values: list[str] = []
    values.extend(ABILITY_CONSTANTS[name] for name in re.findall(r"ABILITIES\.([A-Z_]+)\.id", source))
    values.extend(re.findall(r"'([^']+)'", source))
    return [value for value in values if value != "none"]


def parse_cost(block: str, source: Path) -> dict[str, int]:
    cost_source = parse_required(r"cost:\s*\{([^}]+)\}", block, "cost", source)
    cost = {color: 0 for color in GEM_ORDER}
    for color, value in re.findall(r"(red|green|blue|white|black|pearl|gold):\s*(\d+)", cost_source):
        cost[color] = int(value)
    return cost


def parse_real_card_file(path: Path) -> list[dict[str, Any]]:
    text = path.read_text(encoding="utf-8")
    blocks = re.findall(r"\{\s*id:\s*'[^']+'.*?\n\s*\},", text, flags=re.S)
    cards: list[dict[str, Any]] = []

    for block in blocks:
        card = {
            "id": parse_required(r"id:\s*'([^']+)'", block, "id", path),
            "level": int(parse_required(r"level:\s*(\d+)", block, "level", path)),
            "points": int(parse_required(r"points:\s*(\d+)", block, "points", path)),
            "bonusColor": re.search(r"bonusColor:\s*'([^']+)'", block).group(1)
            if re.search(r"bonusColor:\s*'([^']+)'", block)
            else "null",
            "bonusCount": parse_optional_int(r"bonusCount:\s*(\d+)", block, 0),
            "crowns": parse_optional_int(r"crowns:\s*(\d+)", block, 0),
            "cost": parse_cost(block, path),
            "ability": parse_ability(block),
        }
        cards.append(card)

    return cards


def load_real_cards(catalog: str) -> list[dict[str, Any]]:
    level1 = parse_real_card_file(REAL_CARD_FILES["level1"])
    level2 = parse_real_card_file(REAL_CARD_FILES["level2"])
    level3 = parse_real_card_file(REAL_CARD_FILES["level3"])
    if catalog == "classic":
        return level1 + level2 + level3

    rogue_only = parse_real_card_file(REAL_CARD_FILES["rogue"])
    rogue_level2 = [card for card in rogue_only if card["level"] == 2]
    rogue_level3 = [card for card in rogue_only if card["level"] == 3]
    return level1 + level2 + rogue_level2 + level3 + rogue_level3


def color_or_fallback(color: Any) -> str:
    value = str(color)
    if value == "null":
        return NULL_BONUS_RENDER_COLOR
    if value in GEM_ORDER:
        return value
    return RENDER_COLOR_FALLBACK


def real_card_to_render_card(card: Mapping[str, Any]) -> dict[str, Any]:
    render_color = color_or_fallback(card.get("bonusColor"))
    bonus_color = str(card.get("bonusColor", "null"))
    top_cloth_color = JOKER_TOP_CLOTH_COLOR if bonus_color == "gold" else render_color
    point_ribbon_color = JOKER_POINT_RIBBON_COLOR if bonus_color == "gold" else render_color
    bonus_count = int(card.get("bonusCount", 0))
    is_pure_points_card = (
        int(card.get("points", 0)) > 0
        and int(card.get("crowns", 0)) == 0
        and (bonus_color == "null" or bonus_count <= 0)
    )
    costs = [
        {"color": color, "value": str(card["cost"][color])}
        for color in GEM_ORDER
        if int(card["cost"].get(color, 0)) > 0
    ]
    if len(costs) > MAX_COST_TOKENS:
        raise ValueError(f"{card['id']} has {len(costs)} non-zero costs; max supported is {MAX_COST_TOKENS}.")

    if bonus_color == "gold":
        bonus_gem_color = JOKER_BONUS_BADGE_COLOR
    else:
        bonus_gem_color = bonus_color
    bonus_gem_colors = [bonus_gem_color] * bonus_count if bonus_color in GEM_ORDER and bonus_count > 0 else []

    return {
        "id": card["id"],
        "points": str(card["points"]),
        "topClothColor": top_cloth_color,
        "showTopCloth": not is_pure_points_card,
        "pointRibbonColor": point_ribbon_color,
        "bonusGemColors": bonus_gem_colors,
        "crowns": int(card.get("crowns", 0)),
        "abilities": list(card.get("ability", [])),
        "costs": costs,
    }


def render_costs(
    canvas: Image.Image,
    paths: Mapping[str, Any],
    layout: Mapping[str, Any],
    costs: list[Mapping[str, Any]],
) -> None:
    layer = layout["layers"]["costTokens"]
    max_slots = int(layer.get("maxSlots", MAX_COST_TOKENS))
    if len(costs) > max_slots:
        raise ValueError(f"Card has {len(costs)} costs; max supported is {max_slots}.")
    start_slot = max_slots - len(costs)

    for index, cost in enumerate(costs):
        color = str(cost["color"])
        value = cost["value"]
        asset = open_rgba(template_path(paths, "costToken", color=color))

        token_x = int(layer["x"])
        token_y = int(layer["y"]) + (start_slot + index) * int(layer["stepY"])
        token_w = int(layer["w"])
        token_h = round(token_w * asset.height / asset.width)
        token_scale = token_w / asset.width

        token = fit_or_fill(
            asset,
            token_w,
            token_h,
            str(layer.get("scaleMode", "fit")),
            str(layer.get("alignX", "center")),
            str(layer.get("alignY", "center")),
        )
        paste_alpha(canvas, token, token_x, token_y)

        value_center_x = token_x + float(layer["valueAnchorX"]) * token_scale
        value_center_y = token_y + float(layer["valueAnchorY"]) * token_scale
        gem_center_x = token_x + float(layer["gemAnchorX"]) * token_scale
        gem_center_y = token_y + float(layer["gemAnchorY"]) * token_scale

        paste_number_centered(
            canvas,
            paths,
            value,
            value_center_x,
            value_center_y,
            int(layer["valueSize"]),
        )
        paste_gem_centered(
            canvas,
            paths,
            color,
            gem_center_x,
            gem_center_y,
            int(layer["gemSize"]),
        )


def apply_card_clip(image: Image.Image, radius: int) -> Image.Image:
    mask = Image.new("L", image.size, 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle((0, 0, image.width, image.height), radius=radius, fill=255)
    clipped = image.copy()
    clipped.putalpha(ImageChops.multiply(clipped.getchannel("A"), mask))
    return clipped


def render_card(layout: Mapping[str, Any], card: Mapping[str, Any]) -> Image.Image:
    card_box = layout["card"]
    width = int(card_box["width"])
    height = int(card_box["height"])
    canvas = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    paths = layout["paths"]
    layers = layout["layers"]

    paste_asset(canvas, paths, "cardFace", layers["cardFace"], id=card["id"])
    if card.get("showTopCloth", True):
        paste_asset(canvas, paths, "topCloth", layers["topCloth"], color=card["topClothColor"])

    render_costs(canvas, paths, layout, list(card.get("costs", [])))

    abilities = active_abilities(card)
    points = int(card.get("points", 0))

    if points > 0 or abilities:
        paste_asset(
            canvas,
            paths,
            "pointRibbon",
            layers["pointRibbon"],
            variant=point_ribbon_variant(card),
            color=card["pointRibbonColor"],
        )

    ability_slots = layers["abilityMedallions"]
    for index, ability in enumerate(abilities[: len(ability_slots)]):
        relative_path = ability_path(paths, str(ability))
        if relative_path:
            paste_specific_asset(canvas, relative_path, ability_slots[index])

    relative_crown_path = crown_path(paths, card.get("crowns"))
    relative_crown_layer = crown_layer(layers, card.get("crowns"))
    if relative_crown_path and relative_crown_layer:
        paste_specific_asset(canvas, relative_crown_path, relative_crown_layer)

    bonus_colors = list(card.get("bonusGemColors", []))
    for index, color in enumerate(bonus_colors[: len(layers["bonusGemBadges"])]):
        badge = layers["bonusGemBadges"][index]
        paste_bonus_gem_badge(canvas, paths, str(color), badge)

    if points > 0:
        point_value = layers["pointValue"]
        if "x" in point_value:
            point_center_x = float(point_value["x"]) + float(point_value["w"]) / 2
            point_center_y = float(point_value["y"]) + float(point_value["h"]) / 2
            point_size = int(min(float(point_value["w"]), float(point_value["h"])))
        else:
            point_center_x = float(point_value["centerX"])
            point_center_y = float(point_value["centerY"])
            point_size = int(point_value["size"])
        point_center_y += point_value_offset_y(point_value, len(abilities))
        paste_number_centered(
            canvas,
            paths,
            card["points"],
            point_center_x,
            point_center_y,
            point_size,
        )

    for index, color in enumerate(bonus_colors[: len(layers["bonusGemBadges"])]):
        badge = layers["bonusGemBadges"][index]
        paste_badge_gem_centered(canvas, paths, str(color), badge)

    return apply_card_clip(canvas, int(card_box["cornerRadius"]))


def render_cards(layout: Mapping[str, Any], cards: list[Mapping[str, Any]], output_dir: Path) -> list[Path]:
    output_dir.mkdir(parents=True, exist_ok=True)
    rendered_paths: list[Path] = []

    for card in cards:
        render_card_input = real_card_to_render_card(card)
        image = render_card(layout, render_card_input)
        output_path = output_dir / f"{card['id']}.png"
        image.save(output_path)
        rendered_paths.append(output_path)

    return rendered_paths


def validate_rendered_catalog(cards: list[Mapping[str, Any]], output_paths: list[Path], layout: Mapping[str, Any]) -> None:
    expected_ids = {str(card["id"]) for card in cards}
    output_ids = {path.stem for path in output_paths}
    if len(output_paths) != len(expected_ids):
        raise ValueError(f"Rendered {len(output_paths)} files for {len(expected_ids)} cards.")
    if output_ids != expected_ids:
        missing = sorted(expected_ids - output_ids)
        extra = sorted(output_ids - expected_ids)
        raise ValueError(f"Rendered file IDs do not match RealCards. missing={missing} extra={extra}")

    expected_size = (int(layout["card"]["width"]), int(layout["card"]["height"]))
    for path in output_paths:
        with Image.open(path) as image:
            if image.size != expected_size or image.mode != "RGBA":
                raise ValueError(f"{path} has {image.size} {image.mode}; expected {expected_size} RGBA.")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Render a GemDuel standard card sample.")
    parser.add_argument("--layout", type=Path, default=DEFAULT_LAYOUT)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--output-dir", type=Path, default=DEFAULT_BATCH_OUTPUT_DIR)
    parser.add_argument("--card-id", default=None, help="Override the demo card art id.")
    parser.add_argument("--all-real-cards", action="store_true", help="Render every RealCard in the selected catalog.")
    parser.add_argument("--catalog", choices=("classic", "rogue"), default="rogue")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    layout_path = args.layout if args.layout.is_absolute() else REPO_ROOT / args.layout
    layout = read_json(layout_path)

    if args.all_real_cards:
        output_dir = args.output_dir if args.output_dir.is_absolute() else REPO_ROOT / args.output_dir
        cards = load_real_cards(args.catalog)
        output_paths = render_cards(layout, cards, output_dir)
        validate_rendered_catalog(cards, output_paths, layout)
        print(f"Rendered {len(output_paths)} {args.catalog} cards to {output_dir}")
        return

    output_path = args.output if args.output.is_absolute() else REPO_ROOT / args.output
    card = dict(layout["demo"])
    if args.card_id:
        card["id"] = args.card_id

    image = render_card(layout, card)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    image.save(output_path)
    print(output_path)


if __name__ == "__main__":
    main()
