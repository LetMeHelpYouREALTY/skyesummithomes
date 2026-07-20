#!/usr/bin/env node
/**
 * Regenerates favicon assets from images/agents/design 05_new 2.jpg
 * Requires: python3 + Pillow (pip install Pillow)
 */
'use strict';

const { execFileSync } = require('child_process');
const path = require('path');

const root = path.join(__dirname, '..');
const py = `
from PIL import Image
from pathlib import Path
import shutil

root = Path(${JSON.stringify(root)})
src = root / 'images' / 'agents' / 'design 05_new 2.jpg'
img = Image.open(src).convert('RGBA')
w, h = img.size
side = min(w, h)
left = (w - side) // 2
top = (h - side) // 2
img = img.crop((left, top, left + side, top + side))

brand = root / 'images' / 'brand'
brand.mkdir(parents=True, exist_ok=True)
master = brand / 'dr-jan-duffy-icon.png'
img.resize((512, 512), Image.Resampling.LANCZOS).save(master, 'PNG', optimize=True)

for name, size in {
    'favicon-16x16.png': 16,
    'favicon-32x32.png': 32,
    'apple-touch-icon.png': 180,
    'android-chrome-192x192.png': 192,
    'android-chrome-512x512.png': 512,
}.items():
    img.resize((size, size), Image.Resampling.LANCZOS).save(brand / name, 'PNG', optimize=True)

im16 = img.resize((16, 16), Image.Resampling.LANCZOS)
im32 = img.resize((32, 32), Image.Resampling.LANCZOS)
im48 = img.resize((48, 48), Image.Resampling.LANCZOS)
im48.save(root / 'favicon.ico', format='ICO', sizes=[(48, 48), (32, 32), (16, 16)], append_images=[im32, im16])
shutil.copy(brand / 'favicon-16x16.png', root / 'favicon-16x16.png')
shutil.copy(brand / 'favicon-32x32.png', root / 'favicon-32x32.png')
shutil.copy(brand / 'apple-touch-icon.png', root / 'apple-touch-icon.png')
shutil.copy(root / 'favicon.ico', brand / 'favicon.ico')
print('generate-favicon: wrote root + images/brand favicon assets')
`;

execFileSync('python3', ['-c', py], { stdio: 'inherit' });
