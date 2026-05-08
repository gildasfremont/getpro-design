#!/usr/bin/env python3
"""Crop <input> to first <height> pixels (top-aligned) into <output>.

Usage: crop.py <input.png> <output.png> <height>
"""
import sys
from PIL import Image

inp, out, h = sys.argv[1], sys.argv[2], int(sys.argv[3])
img = Image.open(inp)
img.crop((0, 0, img.width, min(h, img.height))).save(out)
print(f'cropped {inp} -> {out} ({img.width}x{min(h, img.height)})')
