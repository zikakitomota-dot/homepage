# Habitat artwork specification

- Production canvas: **1600 × 1200 px (4:3)** for every habitat.
- Production format: **WebP**, exported around **quality 84** (acceptable range 82–86).
- Composition: keep all essential landmarks, animals-free focal details, and recognisable habitat cues inside the central **70% safe area**. Treat the outer 15% on every edge as crop-safe, low-detail breathing room.
- Do not bake habitat names or other text into the image. The game always displays the accessible habitat label in a separate band below the artwork.
- Rendering: the game uses a fixed 4:3 box with `object-fit: cover`. Matching the required 4:3 source prevents normal cropping while keeping accidental off-ratio replacements edge-to-edge.
- Intentional space: no blank label area is required, but use calm, low-detail edges so the small mobile cards remain clear.

Use these exact names:

`forest.webp`, `desert.webp`, `ocean.webp`, and `ice-and-snow.webp`.

The game displays a lightweight colour-and-emoji placeholder whenever an enabled artwork file is missing. After all files are supplied, set `USE_FINAL_ARTWORK` to `true` in `components/games/animal-habitats-game.tsx`.
