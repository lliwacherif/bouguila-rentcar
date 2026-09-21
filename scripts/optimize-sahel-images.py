"""Rebuild project-bound WebP assets from the generated campaign photographs."""
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
GENERATED = Path(r'C:\Users\ADMIN\.codex\generated_images\01a0c446-d5f4-7f62-90ad-b241524496b4')
OUT = ROOT / 'public' / 'images'
OUT.mkdir(parents=True, exist_ok=True)
SOURCES = {
    'sahel-planning': 'exec-567ca20c-c96e-4e72-b5e7-e4b7126a94f9.png',
    'sahel-hero': 'exec-7e30b30e-c3d2-439d-b20c-71b77835d957.png',
    'sahel-coast': 'exec-89887150-2de9-4019-883b-c0fd28d3a2dd.png',
    'sahel-keys': 'exec-73fdc2ed-4996-4f90-95a4-b777517b61b3.png',
}
for name, filename in SOURCES.items():
    with Image.open(GENERATED / filename) as original:
        photo = original.convert('RGB')
        photo.thumbnail((1536 if name == 'sahel-hero' else 1200, 1024 if name == 'sahel-hero' else 800))
        photo.save(OUT / f'{name}.webp', 'WEBP', quality=84, method=6)
        if name == 'sahel-hero':
            mobile = ImageOps.fit(original.convert('RGB'), (720, 1000), centering=(0.78, 0.5))
            mobile.save(OUT / 'sahel-hero-mobile.webp', 'WEBP', quality=82, method=6)
with Image.open(ROOT / 'public' / 'Bouguila logo.png') as logo:
    logo.thumbnail((160, 160))
    logo.save(OUT / 'bouguila-logo.webp', 'WEBP', quality=90, method=6)
for filename in ['app_mockup.png', 'car_hyundai.png', 'car_vw_golf.png', 'car_berline.png', 'car_suv.png', 'car_luxe.png', 'car_citadine.png', 'car_utilitaire.png']:
    with Image.open(ROOT / 'public' / filename) as original:
        original.thumbnail((640, 640))
        original.save(OUT / f'{Path(filename).stem}.webp', 'WEBP', quality=82, method=6)
for path in OUT.glob('*.webp'):
    print(f'{path.name}: {path.stat().st_size // 1024} KB')
