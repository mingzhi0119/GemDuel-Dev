#!/usr/bin/env python3
"""Compose the Joker bonus symbol from the five basic gem assets.

Edit GEM_PLACEMENTS below to fine-tune the layout. Coordinates are in the
512x512 output canvas. Each tuple is:

    color, center_x, center_y, max_box_size

The script crops each source gem to its visible alpha bounds, scales it to fit
inside max_box_size, then places it at the requested center.
"""

from __future__ import annotations

import argparse
from itertools import combinations
from pathlib import Path

from PIL import Image, ImageChops, ImageEnhance


CANVAS_SIZE = 512
ALPHA_OVERLAP_THRESHOLD = 12

# Current layout parameters.
# Tighter than the first non-overlap pass, but still validates at 0 overlap.
GEM_PLACEMENTS = [
    ("black", 209, 163, 94),
    ("white", 303, 163, 94),
    ("blue", 172, 264, 102),
    ("red", 340, 264, 102),
    ("green", 256, 340, 106),
]


def repo_root() -> Path:
    return Path(__file__).resolve().parents[4]


def default_gem_dir() -> Path:
    return repo_root() / "apps/desktop/public/assets/gems"


def default_output_path() -> Path:
    return Path(__file__).resolve().parent / "bonus-gem-joker-five-basic.png"


def load_gem(gem_dir: Path, color: str, max_box_size: int) -> Image.Image:
    source_path = gem_dir / f"{color}.png"
    image = Image.open(source_path).convert("RGBA")
    bbox = image.getbbox()
    if not bbox:
        raise ValueError(f"{source_path} has no visible foreground.")

    cropped = image.crop(bbox)
    scale = min(max_box_size / cropped.width, max_box_size / cropped.height)
    resized = cropped.resize(
        (round(cropped.width * scale), round(cropped.height * scale)),
        Image.Resampling.LANCZOS,
    )

    alpha = resized.getchannel("A")
    rgb = ImageEnhance.Sharpness(resized.convert("RGB")).enhance(1.05)
    return Image.merge("RGBA", (*rgb.split(), alpha))


def visible_mask(layer: Image.Image) -> Image.Image:
    alpha = layer.getchannel("A")
    return alpha.point(lambda value: 255 if value > ALPHA_OVERLAP_THRESHOLD else 0)


def overlap_pixels(mask_a: Image.Image, mask_b: Image.Image) -> int:
    overlap = ImageChops.multiply(mask_a, mask_b)
    return overlap.histogram()[255]


def compose(gem_dir: Path, output_path: Path, allow_overlap: bool) -> None:
    canvas = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (0, 0, 0, 0))
    masks: list[tuple[str, Image.Image]] = []

    for color, center_x, center_y, max_box_size in GEM_PLACEMENTS:
        gem = load_gem(gem_dir, color, max_box_size)
        x = round(center_x - gem.width / 2)
        y = round(center_y - gem.height / 2)

        layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
        layer.alpha_composite(gem, (x, y))
        masks.append((color, visible_mask(layer)))
        canvas.alpha_composite(gem, (x, y))

    overlap_pairs: list[tuple[str, str, int]] = []
    for (color_a, mask_a), (color_b, mask_b) in combinations(masks, 2):
        overlap = overlap_pixels(mask_a, mask_b)
        if overlap:
            overlap_pairs.append((color_a, color_b, overlap))

    if overlap_pairs and not allow_overlap:
        details = ", ".join(f"{a}/{b}: {count}px" for a, b, count in overlap_pairs)
        raise ValueError(f"Visible gem overlap detected: {details}")

    output_path.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(output_path)
    bbox = canvas.getbbox()
    print(f"Wrote {output_path}")
    print(f"Canvas: {canvas.size}, bbox: {bbox}, overlap: {overlap_pairs or 0}")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--gem-dir",
        type=Path,
        default=default_gem_dir(),
        help="Directory containing black/white/blue/red/green PNG gem assets.",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=default_output_path(),
        help="Output PNG path.",
    )
    parser.add_argument(
        "--allow-overlap",
        action="store_true",
        help="Write the file even when visible gem masks overlap.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    compose(args.gem_dir, args.output, args.allow_overlap)


if __name__ == "__main__":
    main()
