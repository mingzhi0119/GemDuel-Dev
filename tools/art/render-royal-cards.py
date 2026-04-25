#!/usr/bin/env python3
"""Render full royal cards from imported base art and shared card overlays."""

from __future__ import annotations

import argparse
import copy
import importlib.util
from pathlib import Path
from types import ModuleType
from typing import Any

from PIL import Image, ImageDraw, ImageFont


REPO_ROOT = Path(__file__).resolve().parents[2]
STANDARD_RENDERER_PATH = Path(__file__).with_name("render-standard-card.py")
DEFAULT_LAYOUT = REPO_ROOT / "assets/card/layouts/standard-basic.json"
DEFAULT_SOURCE_DIR = REPO_ROOT / "assets/card/generated/royal-layered/from-pic/base"
DEFAULT_OUTPUT_DIR = REPO_ROOT / "apps/desktop/public/assets/cards"
DEFAULT_CONTACT_SHEET = REPO_ROOT / "assets/archive/previews/royal-layered-from-pic/from-pic-full-contact-sheet.png"
CARD_SIZE = (1086, 1448)
RESAMPLE = Image.Resampling.LANCZOS

ROYAL_RENDER_CARDS: tuple[dict[str, Any], ...] = (
    {
        "outputId": "r91-ro",
        "sourceId": "royal-trophy-3pts-base",
        "points": "3",
        "abilities": [],
        "pointOffsetY": 20,
        "abilityOffsetY": 0,
    },
    {
        "outputId": "r92-ro",
        "sourceId": "royal-scepter-2pts-extra-turn-base",
        "points": "2",
        "abilities": ["again"],
        "pointOffsetY": 10,
        "abilityOffsetY": 10,
    },
    {
        "outputId": "r93-ro",
        "sourceId": "r93-ro-2pts-privilege-base",
        "points": "2",
        "abilities": ["scroll"],
        "pointOffsetY": 10,
        "abilityOffsetY": 10,
    },
    {
        "outputId": "r94-ro",
        "sourceId": "royal-saber-2pts-steal-base",
        "points": "2",
        "abilities": ["steal"],
        "pointOffsetY": 10,
        "abilityOffsetY": 10,
    },
)


def load_standard_renderer() -> ModuleType:
    spec = importlib.util.spec_from_file_location("render_standard_card", STANDARD_RENDERER_PATH)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"Unable to load standard renderer from {STANDARD_RENDERER_PATH}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def repo_relative(path: Path) -> str:
    resolved = path.resolve()
    try:
        return resolved.relative_to(REPO_ROOT).as_posix()
    except ValueError as error:
        raise ValueError(f"{resolved} must be inside {REPO_ROOT}") from error


def royal_layout(standard_renderer: ModuleType, layout_path: Path, source_dir: Path) -> dict[str, Any]:
    layout = copy.deepcopy(standard_renderer.read_json(layout_path))
    layout["name"] = "royal-from-pic"
    layout["paths"]["cardFace"] = f"{repo_relative(source_dir)}/{{id}}.png"
    return layout


def render_inputs() -> list[dict[str, Any]]:
    return [
        {
            "id": str(card["sourceId"]),
            "outputId": str(card["outputId"]),
            "points": str(card["points"]),
            "pointRibbonColor": "gold",
            "bonusGemColors": [],
            "crowns": 0,
            "abilities": list(card["abilities"]),
            "costs": [],
            "pointOffsetY": int(card["pointOffsetY"]),
            "abilityOffsetY": int(card["abilityOffsetY"]),
        }
        for card in ROYAL_RENDER_CARDS
    ]


def offset_layer_box(layer: dict[str, Any], offset_y: int) -> dict[str, Any]:
    shifted = dict(layer)
    shifted["y"] = int(shifted["y"]) + offset_y
    return shifted


def render_royal_card(standard_renderer: ModuleType, layout: dict[str, Any], card: dict[str, Any]) -> Image.Image:
    card_box = layout["card"]
    canvas = Image.new("RGBA", (int(card_box["width"]), int(card_box["height"])), (0, 0, 0, 0))
    paths = layout["paths"]
    layers = layout["layers"]

    standard_renderer.paste_asset(canvas, paths, "cardFace", layers["cardFace"], id=card["id"])

    abilities = standard_renderer.active_abilities(card)
    points = int(card.get("points", 0))

    if points > 0 or abilities:
        standard_renderer.paste_asset(
            canvas,
            paths,
            "pointRibbon",
            layers["pointRibbon"],
            variant=standard_renderer.point_ribbon_variant(card),
            color=card["pointRibbonColor"],
        )

    ability_offset_y = int(card.get("abilityOffsetY", 0))
    ability_slots = layers["abilityMedallions"]
    for index, ability in enumerate(abilities[: len(ability_slots)]):
        relative_path = standard_renderer.ability_path(paths, str(ability))
        if relative_path:
            standard_renderer.paste_specific_asset(
                canvas,
                relative_path,
                offset_layer_box(ability_slots[index], ability_offset_y),
            )

    if points > 0:
        point_value = dict(layers["pointValue"])
        point_value["y"] = int(point_value["y"]) + int(card.get("pointOffsetY", 0))
        point_center_x = float(point_value["x"]) + float(point_value["w"]) / 2
        point_center_y = float(point_value["y"]) + float(point_value["h"]) / 2
        if not abilities:
            point_center_y += float(point_value.get("noAbilityOffsetY", 0))
        standard_renderer.paste_number_centered(
            canvas,
            paths,
            card["points"],
            point_center_x,
            point_center_y,
            int(min(float(point_value["w"]), float(point_value["h"]))),
        )

    return standard_renderer.apply_card_clip(canvas, int(card_box["cornerRadius"]))


def validate_output(path: Path) -> None:
    with Image.open(path) as image:
        if image.size != CARD_SIZE or image.mode != "RGBA":
            raise ValueError(f"{path} has {image.size} {image.mode}; expected {CARD_SIZE} RGBA.")


def write_contact_sheet(paths: list[Path], output_path: Path) -> None:
    thumb_width = 240
    thumb_height = round(thumb_width * CARD_SIZE[1] / CARD_SIZE[0])
    padding = 18
    label_height = 56
    sheet_width = padding + len(paths) * (thumb_width + padding)
    sheet_height = padding * 2 + thumb_height + label_height
    sheet = Image.new("RGBA", (sheet_width, sheet_height), (245, 245, 245, 255))
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default()

    for index, path in enumerate(paths):
        x = padding + index * (thumb_width + padding)
        y = padding
        with Image.open(path).convert("RGBA") as image:
            thumb = image.resize((thumb_width, thumb_height), RESAMPLE)
        sheet.alpha_composite(thumb, (x, y))
        draw.rectangle((x, y + thumb_height, x + thumb_width, y + thumb_height + label_height), fill=(255, 255, 255, 255))
        draw.text((x + 8, y + thumb_height + 9), path.stem, fill=(24, 24, 27, 255), font=font)
        draw.text((x + 8, y + thumb_height + 30), f"{CARD_SIZE[0]}x{CARD_SIZE[1]}", fill=(82, 82, 91, 255), font=font)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(output_path)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Render all royal full-card PNGs from imported base art.")
    parser.add_argument("--layout", type=Path, default=DEFAULT_LAYOUT)
    parser.add_argument("--source-dir", type=Path, default=DEFAULT_SOURCE_DIR)
    parser.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT_DIR)
    parser.add_argument("--contact-sheet", type=Path, default=DEFAULT_CONTACT_SHEET)
    parser.add_argument("--skip-contact-sheet", action="store_true")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    standard_renderer = load_standard_renderer()
    layout = royal_layout(standard_renderer, args.layout.resolve(), args.source_dir.resolve())
    output_dir = args.output_dir.resolve()
    output_dir.mkdir(parents=True, exist_ok=True)

    output_paths: list[Path] = []
    for card in render_inputs():
        image = render_royal_card(standard_renderer, layout, card)
        output_path = output_dir / f"{card['outputId']}.png"
        image.save(output_path)
        validate_output(output_path)
        output_paths.append(output_path)

    if not args.skip_contact_sheet:
        write_contact_sheet(output_paths, args.contact_sheet.resolve())

    print(f"Rendered {len(output_paths)} royal cards to {output_dir}")
    if not args.skip_contact_sheet:
        print(f"Contact sheet: {args.contact_sheet.resolve()}")


if __name__ == "__main__":
    main()
