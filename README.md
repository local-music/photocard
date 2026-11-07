# PhotoBook Studio V3 — preview and configurator prototype

Upload `index.html`, `style.css`, `app.js` to the root of a GitHub Pages repository. No libraries, external servers or CDN dependencies are needed.

## Implemented
Seven-step gated configurator, interactive Canvas2D animated book illustration, drag-to-rotate, scroll zoom, open/close, explode, undo/redo, local save, cover drawing, cover image preview, text, custom photo dimensions, 2–20 pages, colour choices, filename, offline 3MF ZIP exporter with separate cover/page material assignments.

## Important engineering limitations
The 3MF contains **simple rectangular manifold prototype parts**, not the detailed model shown in the animated preview. In particular, photo slots, hinges, wall holes, keyring holes, photo windows, artwork embossing, and actual assembled clearances are NOT implemented in the exported geometry. It must not be described as print-ready. Canvas preview is a 3D-style illustration rather than a true mesh renderer. 3MF base material colours may be displayed differently depending on slicer; they are not filament assignments.

The next phase requires designing and validating real parametric geometry (photo-retaining rails, hinge barrels, snap-fit clearances), then using that same mesh data for both a genuine 3D preview and 3MF export. Do not print a full book expecting assembly from this release.
