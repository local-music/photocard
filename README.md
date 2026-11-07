# PhotoBook Studio V4 — WebGL prototype

Upload index.html, style.css, app.js and viewer.js together to GitHub Pages.

The preview now uses Three.js WebGL, with OrbitControls for real 3D rotation. It requires internet access to load Three.js and JSZip from CDNs. Export creates a standard OPC/3MF ZIP using JSZip, with mesh resources, materials, and a build list.

**Engineering status:** This is a prototype, not a validated working photo book. Photo pocket frames are modeled, but hinge connections, photo-retaining tolerances, wall/keyring holes, text embossing and cover artwork exports are not implemented. Each rail is exported as a separate mesh/build item; they are not yet fused into watertight page bodies. Do not print a full book expecting it to assemble. Open in Bambu Studio to inspect the export; test fit before committing to a print.
