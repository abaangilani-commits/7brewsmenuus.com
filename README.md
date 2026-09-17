# Independent 7 Brew Menu Guide

Original official product photographs have been restored at the user's request. Category fallbacks are visibly labelled. Source records are in assets/products/sources.json. Reuse permission has not been verified; attribution is not a licence.

The illustrations are not used by the site. Do not run archived illustration generators.

After changing menu data, run `node scripts/prerender-menu.js`. Preview with `python -m http.server 8080`; validate with `python scripts/check-site.py`. Prices and nutrition remain estimates. The site is independent and not endorsed by 7 Brew.

State and city location pages (/locations/<st> and /locations/<st>/<city>) are generated from assets/locations.json. After refreshing that file, run `node tools/build-locations.js`; it rewrites location-pages/ and the marked LOCATIONS blocks in locations.html, index.html and sitemap.xml. Hand-written city intros live in tools/city-notes.json.
