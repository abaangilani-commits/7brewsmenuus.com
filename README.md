# Independent 7 Brew Menu Guide

Original official product photographs have been restored at the user's request. Category fallbacks are visibly labelled. Source records are in assets/products/sources.json. Reuse permission has not been verified; attribution is not a licence.

The illustrations are not used by the site. Do not run archived illustration generators.

After changing menu data, run `node scripts/prerender-menu.js`. Preview with `python -m http.server 8080`; validate with `python scripts/check-site.py`. Prices and nutrition remain estimates. The site is independent and not endorsed by 7 Brew.

State and city location pages (/locations/<st> and /locations/<st>/<city>) are generated from assets/locations.json. After refreshing that file, run `node tools/build-locations.js`; it rewrites location-pages/ and the marked LOCATIONS blocks in locations.html, index.html and sitemap.xml. Hand-written city intros live in tools/city-notes.json.

The price, caffeine and calorie tables on /energy-drinks and /nutrition-calories are generated: run `node tools/build-drink-tables.js` after changing js/official-nutrition.js or js/menu-data.js. It fills the <!-- DRINKS:*:START/END --> blocks. Calories, caffeine and sugar come from the official nutrition guide; prices come from menu-data.js and are estimates.

Per-drink pages are generated: `node tools/build-drink-pages.js` builds a page for each drink in tools/drink-pages.json plus the /teas-chai hub, and refreshes the DRINKS:INDEX blocks on guides, energy-drinks, fizz-drinks, lemonades and matcha. Allergens come from tools/drink-allergens.json, parsed from 7 Brew’s nutrition PDF; it never overwrites a hand-written page.

The downloadable menu PDF is generated: `node tools/build-menu-pdf.js` renders tools/menu-print.html (built from js/menu-data.js and js/official-nutrition.js) to assets/7-brew-menu-prices.pdf using headless Chrome. Set CHROME=/path/to/chrome if it is not found. Do not publish 7 Brew’s own menu artwork — it is their copyright; this PDF is our own layout built from our data.
