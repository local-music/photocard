# PhotoBook Studio — V1 prototype

A free, independent 3D-printable photo-book configurator. No account or backend required.

## Launch

Upload `index.html`, `style.css`, and `app.js` to the root of a GitHub repository, then enable **Settings → Pages → Deploy from a branch → main / root**. The site imports Three.js and JSZip from public CDNs, so an internet connection is required to load the editor.

For local testing run `python3 -m http.server 8000` in this folder and open `http://localhost:8000`.

## What works

- 8 preset photo formats plus custom dimensions
- 2–20 pages, page/cover colour choices, photo paper thickness and slot clearance
- Horizontal/vertical design choices, cover window, wall tabs, keyring loop, hinge options
- Interactive 3D preview and exploded view
- STL ZIP export, per-part, and a starter OpenSCAD page file
- A4 photo print sheet using uploaded images (browser print, actual size)
- Browser-local design saving and JSON export

## IMPORTANT — engineering limitations

This is a **first mechanical prototype**, not a validated finished product. Geometry has not been printed or test-fitted. Some feature choices (hinge variants, orientation, photo spine, cover artwork) are represented approximately, not fully engineered. The STL exports use multiple intersecting closed primitives and may require **union/repair** in a slicer or CAD tool. The cover hinge geometry is not yet a complete matched, articulated hinge assembly. Open/close preview is illustrative, not a physics-accurate assembly. OpenSCAD export currently covers the page only, not all pieces. The A4 photo sheet does not auto-rotate images for maximum packing.

Before full production: (1) print a single page to verify the photo paper slides and is retained; (2) prototype hinge clearances; (3) validate page flipping, cover connection, wall mounting and load; (4) refine printable solids and add automated manifold validation. For print-in-place hinges, clearances and print orientation are especially important.

Not affiliated with AF Inventions. This is an original implementation based on general functional requirements, not a copy of proprietary CAD files.
