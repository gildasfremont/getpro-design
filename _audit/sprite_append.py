#!/usr/bin/env python3
"""Append a labelled, downscaled copy of <input> to a horizontal sprite.

Usage: sprite_append.py <input.png> <label> <sprite.png>

Each call adds one column to <sprite>: a label band + a width-normalized
copy of <input> stacked under it. Columns are separated by GAP px. <input>
is deleted after a successful append.
"""
import os
import sys
from PIL import Image, ImageDraw, ImageFont

COL_W = 240
GAP = 12
LABEL_H = 30
PAD = 12
BG = (245, 244, 240)
LABEL_BG = (20, 20, 20)
LABEL_FG = (245, 244, 240)


def load_font(size: int) -> ImageFont.ImageFont:
    for path in (
        '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
        '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
    ):
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def make_column(src_path: str, label: str) -> Image.Image:
    img = Image.open(src_path).convert('RGB')
    ratio = COL_W / img.width
    new_h = int(img.height * ratio)
    img = img.resize((COL_W, new_h), Image.LANCZOS)

    column = Image.new('RGB', (COL_W, LABEL_H + new_h), BG)
    draw = ImageDraw.Draw(column)
    draw.rectangle((0, 0, COL_W, LABEL_H), fill=LABEL_BG)
    font = load_font(14)
    draw.text((10, 8), label, fill=LABEL_FG, font=font)
    column.paste(img, (0, LABEL_H))
    return column


def append_column(col: Image.Image, sprite_path: str) -> None:
    if os.path.exists(sprite_path):
        sprite = Image.open(sprite_path).convert('RGB')
        new_w = sprite.width + GAP + col.width
        new_h = max(sprite.height, col.height + PAD * 2)
        out = Image.new('RGB', (new_w, new_h), BG)
        out.paste(sprite, (0, 0))
        out.paste(col, (sprite.width + GAP, PAD))
    else:
        new_w = col.width + PAD * 2
        new_h = col.height + PAD * 2
        out = Image.new('RGB', (new_w, new_h), BG)
        out.paste(col, (PAD, PAD))
    out.save(sprite_path, optimize=True)


def main() -> int:
    if len(sys.argv) != 4:
        print(__doc__)
        return 2
    src, label, sprite = sys.argv[1:]
    if not os.path.exists(src):
        print(f'missing input: {src}', file=sys.stderr)
        return 1
    col = make_column(src, label)
    append_column(col, sprite)
    os.remove(src)
    print(f'appended {label} ({col.width}x{col.height}) -> {sprite}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
