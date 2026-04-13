import os
import math

try:
    from PIL import Image, ImageDraw, ImageFilter
except ImportError:
    import subprocess
    import sys
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
    from PIL import Image, ImageDraw, ImageFilter

os.makedirs("public/frames", exist_ok=True)

width, height = 800, 600
num_frames = 150

print("Generating 150 frames...")
for i in range(1, num_frames + 1):
    img = Image.new('RGB', (width, height), color=(10, 10, 15))
    draw = ImageDraw.Draw(img)
    
    # Create some cinematic morphing shapes
    progress = i / num_frames
    
    # A central glowing orb that comes into focus
    cx, cy = width // 2, height // 2
    radius = 100 + math.sin(progress * math.pi) * 50
    
    # Noise effect that reduces over time (Noise-Resilient AI)
    noise_intensity = int(100 * (1 - progress))
    if noise_intensity > 0:
        import random
        for _ in range(noise_intensity * 100):
            x = random.randint(0, width - 1)
            y = random.randint(0, height - 1)
            draw.point((x, y), fill=(255, 255, 255, int(random.random()*255)))
    
    # Draw orb
    opacity = int(255 * (0.2 + 0.8 * progress))
    for r in range(int(radius), 0, -2):
        shade = int((1 - r / radius) * 200 * progress)
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(shade, int(shade*0.8), int(shade*1.5), opacity))
    
    # Lines representing neural network / data
    num_lines = int(20 * progress)
    for j in range(num_lines):
        x1 = (cx + math.cos(progress * math.pi * 4 + j) * 200)
        y1 = (cy + math.sin(progress * math.pi * 4 + j) * 200)
        draw.line([cx, cy, x1, y1], fill=(100, 150, 255, 100), width=2)
    
    # Apply a slight blur
    img = img.filter(ImageFilter.GaussianBlur(radius=1.5 if progress < 0.5 else 0))
    
    filename = f"public/frames/frame_{i:03d}.png"
    img.save(filename)

print("Frames generated successfully!")
