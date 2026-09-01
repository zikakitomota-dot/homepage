# Animal artwork specification

- Production canvas: **1200 × 900 px (4:3)** for every animal.
- Production format: **WebP with alpha transparency**, exported around **quality 88** with full-quality alpha. Keep a lossless PNG master if useful, but deploy the `.webp` file.
- Background: fully transparent. Do not include habitat scenery, a floor, a frame, or baked-in text.
- Padding: keep at least **8% transparent space on every side** (96 px left/right and 72 px top/bottom). Soft paint edges and shadows must also remain inside this safe area.
- Normalisation: fit the full-body silhouette inside the central 84% of the canvas. Scale by visual mass so wide animals such as the shark and camel and tall animals such as the penguin feel equally prominent.
- Rendering: the game uses `object-fit: contain`; artwork is never cropped or distorted.

Use these exact names:

`deer.webp`, `owl.webp`, `red-squirrel.webp`, `raccoon.webp`, `camel.webp`, `fennec-fox.webp`, `meerkat.webp`, `desert-tortoise.webp`, `dolphin.webp`, `shark.webp`, `octopus.webp`, `sea-turtle.webp`, `polar-bear.webp`, `penguin.webp`, `walrus.webp`, and `arctic-fox.webp`.

The game displays a lightweight emoji placeholder whenever an enabled artwork file is missing. After all files are supplied, set `USE_FINAL_ARTWORK` to `true` in `components/games/animal-habitats-game.tsx`.
