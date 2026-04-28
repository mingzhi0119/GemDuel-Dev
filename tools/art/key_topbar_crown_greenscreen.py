#!/usr/bin/env python3
"""Key greenscreen from TopBar crown source and write a transparent PNG for the desktop bundle."""

from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np
from PIL import Image


def key_crown(src: Path, dst: Path) -> None:
    im = Image.open(src).convert("RGBA")
    arr = np.asarray(im).astype(np.float32) / 255.0
    r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
    alpha_in = arr[:, :, 3]

    # Display greenscreen is high-G chartreuse, not pure (0,1,0): use excess green over max(R,B).
    green_excess = g - np.maximum(r, b)
    key = 1.0 - np.clip((green_excess - 0.14) / 0.5, 0.0, 1.0)
    key = np.where(g < 0.22, 1.0, key)

    spill = np.clip(g - np.maximum(r, b), 0.0, 1.0)
    g1 = np.clip(g - 0.5 * spill * (1.0 - key), 0.0, 1.0)
    r1 = np.clip(r + 0.14 * spill * (1.0 - key), 0.0, 1.0)
    b1 = np.clip(b + 0.1 * spill * (1.0 - key), 0.0, 1.0)

    a_out = np.clip(key * alpha_in * 255.0, 0.0, 255.0).astype(np.uint8)
    rgb_out = np.clip(np.stack([r1, g1, b1], axis=-1) * 255.0, 0.0, 255.0).astype(np.uint8)
    out = np.concatenate([rgb_out, a_out[..., None]], axis=-1)
    dst.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(out, "RGBA").save(dst, compress_level=9)


def main() -> None:
    root = Path(__file__).resolve().parents[2]
    default_src = root / "assets" / "card" / "overlays" / "CrownBadges" / "crown-gold-green-screen.png"
    default_dst = root / "apps" / "desktop" / "public" / "assets" / "ui-icons" / "crown-gold-green-screen.png"
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--src", type=Path, default=default_src)
    parser.add_argument("--dst", type=Path, default=default_dst)
    args = parser.parse_args()
    key_crown(args.src, args.dst)
    print(f"Wrote {args.dst}")


if __name__ == "__main__":
    main()
