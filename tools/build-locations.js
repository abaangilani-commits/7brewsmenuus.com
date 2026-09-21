#!/usr/bin/env node
// Generates the state and city location pages from assets/locations.json.
//
//   node tools/build-locations.js
//
// Output:
//   location-pages/<st>.html          served at /locations/<st>
//   location-pages/<st>/<city>.html   served at /locations/<st>/<city>
// and refreshes the generated blocks in locations.html, index.html and sitemap.xml
// (between <!-- LOCATIONS:... --> markers). URL rewrites live in .htaccess.
//
// City pages are built for cities with MIN_CITY_STANDS or more stands, plus the
// legacy city guides in tools/city-notes.json. Every stand is listed on its state page.

'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const SITE = 'https://7brewsmenuus.com';
const OUT_DIR = path.join(ROOT, 'location-pages');
const MIN_CITY_STANDS = 1;
const ASSET_VERSION = '20260912c';

const STATE_NAMES = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California', CO: 'Colorado', CT: 'Connecticut',
  DE: 'Delaware', FL: 'Florida', GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
  KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan',
  MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire',
  NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio',
  OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota',
  TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont', VA: 'Virginia', WA: 'Washington', WV: 'West Virginia',
  WI: 'Wisconsin', WY: 'Wyoming', DC: 'District of Columbia',
};
const DAY_CODES = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const DAY_SHORT = { Mo: 'Mon', Tu: 'Tue', We: 'Wed', Th: 'Thu', Fr: 'Fri', Sa: 'Sat', Su: 'Sun' };
const DAY_SCHEMA = { Mo: 'Monday', Tu: 'Tuesday', We: 'Wednesday', Th: 'Thursday', Fr: 'Friday', Sa: 'Saturday', Su: 'Sunday' };

// ---------- helpers ----------
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
const slugify = s => decodeURIComponent(s).normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const listJoin = arr => arr.length <= 1 ? arr.join('') : arr.slice(0, -1).join(', ') + ' and ' + arr[arr.length - 1];
const readText = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
function writeText(f, s) {
  const full = path.join(ROOT, f);
  const crlf = fs.existsSync(full) && fs.readFileSync(full, 'utf8').includes('\r\n');
  fs.writeFileSync(full, crlf ? s.replace(/\r?\n/g, '\r\n') : s);
}

function fmtTime(hhmm) {
  let [h, m] = hhmm.split(':').map(Number);
  if (h === 0 && m === 0) return '12:00 AM (midnight)';
  const ap = h >= 12 && h < 24 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${String(m).padStart(2, '0')} ${ap}`;
}
function fmtDate(iso) {
  return new Date(iso + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}
function haversineMiles(a, b) {
  const R = 3958.8, rad = x => x * Math.PI / 180;
  const dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
function centroid(stands) {
  const pts = stands.filter(s => s.geo);
  if (!pts.length) return null;
  return { lat: pts.reduce((a, s) => a + s.geo.lat, 0) / pts.length, lng: pts.reduce((a, s) => a + s.geo.lng, 0) / pts.length };
}

// Parse ["Mo,Tu,We,Th,Su 05:30-22:00", "Fr,Sa 05:30-23:00"] into a per-day map.
function parseHours(list, where) {
  const week = {};
  for (const entry of list || []) {
    const m = entry.match(/^([A-Za-z,]+) (\d{2}:\d{2})-(\d{2}:\d{2})$/);
    if (!m) throw new Error(`Unrecognised hours "${entry}" for ${where}`);
    for (const d of m[1].split(',')) {
      if (!DAY_CODES.includes(d)) throw new Error(`Unknown day "${d}" for ${where}`);
      week[d] = { opens: m[2], closes: m[3] };
    }
  }
  return week;
}
// Compress a week into runs of consecutive days with identical hours.
function hourRuns(week) {
  const runs = [];
  for (const d of DAY_CODES) {
    const h = week[d];
    const key = h ? `${h.opens}-${h.closes}` : 'closed';
    const last = runs[runs.length - 1];
    if (last && last.key === key) last.days.push(d);
    else runs.push({ key, days: [d], hours: h });
  }
  return runs;
}
function hoursLines(week) {
  return hourRuns(week).map(r => {
    const days = r.days.length === 1 ? DAY_SHORT[r.days[0]] : `${DAY_SHORT[r.days[0]]}–${DAY_SHORT[r.days[r.days.length - 1]]}`;
    return `${days}: ${r.hours ? `${fmtTime(r.hours.opens)}–${fmtTime(r.hours.closes)}` : 'Closed'}`;
  });
}
const hoursKey = week => hoursLines(week).join('; ');

// ---------- load data ----------
const snapshot = JSON.parse(readText('assets/locations.json'));
const CHECKED = fmtDate(snapshot.checked);
const notes = JSON.parse(readText('tools/city-notes.json'));

const stands = snapshot.locations.map(l => {
  const [, st, citySegment] = new URL(l.url).pathname.split('/');
  const state = l.address.addressRegion;
  if (st.toUpperCase() !== state) throw new Error(`State mismatch for ${l.url}`);
  if (!STATE_NAMES[state]) throw new Error(`Unknown state ${state}`);
  const where = l.url;
  return {
    url: l.url,
    street: l.address.streetAddress,
    city: l.address.addressLocality,
    state,
    zip: l.address.postalCode,
    phone: l.telephone || '',
    geo: l.geo && l.geo.latitude ? { lat: Number(l.geo.latitude), lng: Number(l.geo.longitude) } : null,
    week: parseHours(l.hours, where),
    citySlug: slugify(citySegment),
  };
});

// Group into states and cities
const states = new Map();
for (const s of stands) {
  const code = s.state.toLowerCase();
  if (!states.has(code)) states.set(code, { code, abbr: s.state, name: STATE_NAMES[s.state], cities: new Map(), stands: [] });
  const state = states.get(code);
  state.stands.push(s);
  if (!state.cities.has(s.citySlug)) state.cities.set(s.citySlug, { slug: s.citySlug, key: `${code}/${s.citySlug}`, stands: [], state });
  state.cities.get(s.citySlug).stands.push(s);
}
for (const state of states.values()) {
  for (const city of state.cities.values()) {
    // Most common spelling of the city name within the slug
    const counts = {};
    city.stands.forEach(s => { counts[s.city] = (counts[s.city] || 0) + 1; });
    city.name = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
    city.stands.sort((a, b) => a.street.localeCompare(b.street));
    city.center = centroid(city.stands);
    city.hasPage = city.stands.length >= MIN_CITY_STANDS || Boolean(notes[city.key]);
    city.path = city.hasPage ? `/locations/${city.key}` : `/locations/${state.code}#${city.slug}`;
  }
  state.center = centroid(state.stands);
  state.path = `/locations/${state.code}`;
}
for (const key of Object.keys(notes)) {
  const [st, slug] = key.split('/');
  if (!states.get(st) || !states.get(st).cities.get(slug)) throw new Error(`city-notes.json city not in data: ${key}`);
}
const stateList = [...states.values()].sort((a, b) => b.stands.length - a.stands.length || a.name.localeCompare(b.name));
stateList.forEach((s, i) => { s.rank = i + 1; });
const allCities = stateList.flatMap(s => [...s.cities.values()]);

// ---------- shared page chrome (taken from locations.html so nav/footer stay in sync) ----------
const hub = readText('locations.html').replace(/\r\n/g, '\n');
const absolutize = html => html.replace(/(href|src)="(?!https?:|\/|#|mailto:|tel:|data:)([^"]*)"/g, '$1="/$2"');
const HEADER = absolutize(hub.slice(hub.indexOf('<body>') + '<body>'.length, hub.indexOf('<main')));
const FOOTER = absolutize(hub.slice(hub.indexOf('</main>') + '</main>'.length, hub.indexOf('</body>')));
if (!HEADER.includes('site-header') || !FOOTER.includes('site-footer')) throw new Error('Could not extract header/footer from locations.html');

function page({ urlPath, title, description, breadcrumbs, schema, body }) {
  const url = SITE + urlPath;
  const graph = [
    { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: title, description, dateModified: snapshot.checked, isPartOf: { '@id': `${SITE}/#website` } },
    { '@type': 'BreadcrumbList', itemListElement: breadcrumbs.map((b, i) => ({ '@type': 'ListItem', position: i + 1, name: b.name, item: SITE + b.path })) },
    ...schema,
  ];
  const ld = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');
  const crumbs = breadcrumbs.map((b, i) => i === breadcrumbs.length - 1 ? esc(b.name) : `<a href="${b.path}">${esc(b.name)}</a>`).join(' / ');
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1" name="viewport"/><title>${esc(title)}</title><meta content="${esc(description)}" name="description"/><link href="${url}" rel="canonical"/><meta content="${esc(title)}" property="og:title"/><meta content="${esc(description)}" property="og:description"/><meta content="${url}" property="og:url"/><meta content="article" property="og:type"/><meta content="summary_large_image" name="twitter:card"/><meta content="${esc(title)}" name="twitter:title"/><meta content="${esc(description)}" name="twitter:description"/><meta content="${SITE}/assets/products/category-classics.webp" property="og:image"/><meta content="7 Brew classic espresso breve drinks" property="og:image:alt"/><meta content="640" property="og:image:width"/><meta content="640" property="og:image:height"/><link href="/css/styles.css?v=${ASSET_VERSION}" rel="stylesheet"/><link href="/css/modern.css?v=${ASSET_VERSION}" rel="stylesheet"/><link href="/assets/favicon.svg" rel="icon" type="image/svg+xml"/><link href="/favicon.ico" rel="alternate icon" type="image/x-icon"/><link href="/assets/apple-touch-icon.png" rel="apple-touch-icon"/><script type="application/ld+json">${ld}</script></head><body>${HEADER}<main class="research-guide container"><nav aria-label="Breadcrumb">${crumbs}</nav><article>
${body}
<div class="guide-note">This independent guide is not operated or endorsed by 7 Brew. Addresses and hours come from the official 7 Brew locator, checked ${CHECKED}; hours can change, so confirm on the official stand page before you go. <a href="/about#sources">Sources</a>.</div>
</article></main>${FOOTER}</body></html>
`;
}

const faqDetails = faqs => faqs.map(([q, a]) =>
  `<details style="background:var(--card-bg, #f8f5f0); border:1px solid var(--border, #e0dcd5); border-radius:10px; padding:14px 18px; margin-bottom:10px;"><summary style="cursor:pointer; font-weight:600;">${esc(q)}</summary><p style="margin-top:8px;">${esc(a)}</p></details>`).join('\n');
const faqSchema = faqs => ({ '@type': 'FAQPage', mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) });

function directionsUrl(s) {
  return 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(`7 Brew, ${s.street}, ${s.city}, ${s.state} ${s.zip}`);
}
function standRows(list) {
  return list.map(s => `<tr><td>${esc(s.street)}<br/>${esc(s.city)}, ${s.state} ${esc(s.zip)}</td><td>${hoursLines(s.week).map(esc).join('<br/>')}</td><td><a href="${esc(directionsUrl(s))}" rel="noopener">Directions</a><br/><a href="${esc(s.url)}" rel="noopener">Official stand page</a>${s.phone ? `<br/><a href="tel:${esc(s.phone)}">Call</a>` : ''}</td></tr>`).join('\n');
}
const standTable = list => `<div class="guide-table"><table><thead><tr><th scope="col">Address</th><th scope="col">Listed hours (local time)</th><th scope="col">Links</th></tr></thead><tbody>
${standRows(list)}
</tbody></table></div>`;

function standSchema(s, city) {
  return {
    '@type': 'CafeOrCoffeeShop',
    '@id': s.url,
    name: `7 Brew Coffee — ${s.street}, ${city.name}, ${s.state}`,
    brand: { '@type': 'Brand', name: '7 Brew' },
    url: s.url,
    ...(s.phone ? { telephone: s.phone } : {}),
    address: { '@type': 'PostalAddress', streetAddress: s.street, addressLocality: s.city, addressRegion: s.state, postalCode: s.zip, addressCountry: 'US' },
    ...(s.geo ? { geo: { '@type': 'GeoCoordinates', latitude: s.geo.lat, longitude: s.geo.lng } } : {}),
    openingHoursSpecification: hourRuns(s.week).filter(r => r.hours).map(r => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: r.days.map(d => DAY_SCHEMA[d]), opens: r.hours.opens, closes: r.hours.closes })),
  };
}

// Hours summary sentence for a group of stands
function hoursSummary(list, placeName) {
  const groups = {};
  list.forEach(s => { const k = hoursKey(s.week); groups[k] = (groups[k] || 0) + 1; });
  const entries = Object.entries(groups).sort((a, b) => b[1] - a[1]);
  if (entries.length === 1) {
    const prefix = list.length === 1 ? 'The stand is open' : `All ${list.length} stands keep the same hours`;
    return `${prefix}: ${entries[0][0]}.`;
  }
  const opens = list.flatMap(s => Object.values(s.week).map(h => h.opens)).sort();
  return `Hours vary by stand in ${placeName}. The most common schedule (${entries[0][1]} of ${list.length} stands) is ${entries[0][0]}. The earliest listed opening is ${fmtTime(opens[0])}.`;
}
function earliestOpen(list) {
  return fmtTime(list.flatMap(s => Object.values(s.week).map(h => h.opens)).sort()[0]);
}
function latestClose(list) {
  // Treat early-morning closes (after midnight) as later than evening ones
  const val = t => { const [h, m] = t.split(':').map(Number); return (h < 5 ? h + 24 : h) * 60 + m; };
  const closes = list.flatMap(s => Object.values(s.week).map(h => h.closes));
  return fmtTime(closes.sort((a, b) => val(b) - val(a))[0]);
}

function nearbyCities(city, limit) {
  if (!city.center) return [];
  return allCities
    .filter(c => c !== city && c.center)
    .map(c => ({ city: c, miles: haversineMiles(city.center, c.center) }))
    .sort((a, b) => a.miles - b.miles)
    .slice(0, limit);
}

// Chain-wide price ranges by category, from menu-data.js (estimates, not official)
const MENU = (() => {
  const c = { window: {}, document: {} };
  vm.createContext(c);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'js/menu-data.js'), 'utf8') + ';globalThis.M=MENU_DATA;', c);
  return c.M;
})();
function menuPriceTable() {
  const rows = MENU.categories
    .filter(cat => cat.id !== 'all')
    .map(cat => {
      const items = MENU.items.filter(i => i.category === cat.id && i.pricing);
      if (!items.length) return null;
      const lo = Math.min(...items.map(i => i.pricing.small));
      const hi = Math.max(...items.map(i => i.pricing.large));
      if (!(lo > 0) || !(hi > 0)) return null;
      return `<tr><th scope="row" style="font-weight:600;">${esc(cat.name)}</th><td>$${lo.toFixed(2)} – $${hi.toFixed(2)}</td><td>${items.length}</td></tr>`;
    })
    .filter(Boolean);
  return `<div class="guide-table"><table><thead><tr><th scope="col">Menu category</th><th scope="col">Price range (small–large)</th><th scope="col">Drinks</th></tr></thead><tbody>
${rows.join('\n')}
</tbody></table></div>`;
}

// ---------- city pages ----------
function buildCity(city) {
  const { state } = city;
  const n = city.stands.length;
  const place = `${city.name}, ${state.abbr}`;
  const streets = city.stands.map(s => s.street);
  // Searches are shaped "7 brew coffee <city> menu", so the title carries menu intent
  const baseTitle = n === 1
    ? `7 Brew ${place}: Hours, Menu & Address`
    : `7 Brew ${place}: ${n} Locations, Hours & Menu`;
  const title = baseTitle.length <= 53 ? `${baseTitle} (2026)` : baseTitle;
  const describe = withStreets => `${n === 1 ? 'The 7 Brew drive-thru' : `All ${n} 7 Brew drive-thru stands`} in ${city.name}, ${state.abbr}${withStreets ? ` on ${listJoin(streets)}` : ''}: hours, directions, menu prices and nearby stands. Checked ${CHECKED}.`;
  const description = n <= 2 && describe(true).length <= 160 ? describe(true) : describe(false);
  const nearby = nearbyCities(city, 6);
  const note = notes[city.key];

  const faqs = [
    [`How many 7 Brew locations are in ${place}?`,
      n === 1
        ? `There is 1 7 Brew drive-thru in ${city.name}, at ${streets[0]}, according to the official 7 Brew locator checked ${CHECKED}.`
        : `There are ${n} 7 Brew drive-thru stands in ${city.name}: ${listJoin(streets)}. Counts come from the official 7 Brew locator checked ${CHECKED}.`],
    [`What time does 7 Brew open in ${city.name}?`,
      `The earliest listed opening time in ${city.name} is ${earliestOpen(city.stands)}. ${hoursSummary(city.stands, city.name)}`],
    [`What time does 7 Brew close in ${city.name}?`,
      `The latest listed closing time in ${city.name} is ${latestClose(city.stands)}. Most 7 Brew stands close later on Friday and Saturday, so check the hours for your stand above.`],
  ];
  faqs.push([`Does the 7 Brew in ${city.name} have the full menu?`,
    `Yes. The drink menu is the same at every 7 Brew, so ${city.name} gets the same 7 Originals, Classics, 7 Energy, Fizz sodas, lemonades, teas, smoothies and shakes. Seasonal items rotate chain-wide, and any stand can run out of a syrup.`]);
  if (nearby.length) {
    const nb = nearby[0];
    faqs.push([`Where is the nearest 7 Brew outside ${city.name}?`,
      `The closest other city with a 7 Brew is ${nb.city.name}, ${nb.city.state.abbr}, about ${Math.round(nb.miles)} miles away, with ${plural(nb.city.stands.length, 'stand', 'stands')}.`]);
  }

  const body = `<p class="guide-eyebrow">Official directory snapshot · Checked ${CHECKED}</p>
<h1>7 Brew in ${esc(place)}: ${n === 1 ? 'Address &amp; Hours' : `${n} Drive-Thru Locations`}</h1>
<p class="guide-lead">${n === 1 ? `There is 1 7 Brew drive-thru in ${esc(city.name)}, ${esc(state.name)}, at ${esc(streets[0])}.` : `There are ${n} 7 Brew drive-thru stands in ${esc(city.name)}, ${esc(state.name)}.`} ${esc(hoursSummary(city.stands, city.name))}</p>
${note ? `<section><h2>${note.heading}</h2>\n${note.html}\n</section>` : ''}
<section><h2>7 Brew ${esc(city.name)} ${n === 1 ? 'address' : 'addresses'}, hours and directions</h2>
${standTable(city.stands)}
<p>Hours are listed in local time as published on each official stand page. Holiday hours and temporary closures are not included.</p></section>
${nearby.length ? `<section><h2>Other 7 Brew locations near ${esc(city.name)}</h2><ul class="guide-link-grid">
${nearby.map(({ city: c, miles }) => `<li><a href="${c.path}">7 Brew ${esc(c.name)}, ${c.state.abbr}</a> — about ${Math.round(miles)} mi, ${plural(c.stands.length, 'stand', 'stands')}</li>`).join('\n')}
</ul><p>See all ${plural(state.stands.length, 'stand', 'stands')} on the <a href="${state.path}">7 Brew ${esc(state.name)} locations</a> page, or search every stand by ZIP code in the <a href="/locations">nationwide 7 Brew locator</a>.</p></section>` : ''}
<section><h2>7 Brew ${esc(city.name)} menu and prices</h2>
<p>Every 7 Brew serves the same drink menu, so the ${esc(city.name)} board matches the national one. These are our researched price estimates by category — stands are independently owned, so your local prices can differ by a few cents.</p>
${menuPriceTable()}
<p>Full detail: <a href="/">the complete menu with prices</a>, <a href="/nutrition-calories">calories and the nutrition calculator</a>, <a href="/sizes-caffeine">cup sizes and caffeine</a>, and the <a href="/secret-menu">secret menu</a>. Deals run on the <a href="/jackpot-day">7th of every month</a>, and drinks earn <a href="/app-rewards">rewards points</a>.</p></section>
<section><h2>7 Brew ${esc(city.name)} FAQ</h2>
${faqDetails(faqs)}
</section>`;

  return page({
    urlPath: `/locations/${city.key}`,
    title, description,
    breadcrumbs: [{ name: 'Menu', path: '/' }, { name: 'Locations', path: '/locations' }, { name: state.name, path: state.path }, { name: city.name, path: `/locations/${city.key}` }],
    schema: [faqSchema(faqs), ...city.stands.map(s => standSchema(s, city))],
    body,
  });
}

// ---------- state pages ----------
function buildState(state) {
  const n = state.stands.length;
  const cities = [...state.cities.values()].sort((a, b) => a.name.localeCompare(b.name));
  const byCount = [...cities].sort((a, b) => b.stands.length - a.stands.length || a.name.localeCompare(b.name));
  const topCities = byCount.slice(0, 3);
  const title = `7 Brew ${state.name}: ${plural(n, 'Location', 'Locations')} in ${plural(cities.length, 'City', 'Cities')} (2026)`;
  const description = `Find ${n === 1 ? 'the 7 Brew drive-thru' : `all ${n} 7 Brew drive-thru stands`} in ${state.name}${cities.length > 1 ? `, including ${listJoin(topCities.map(c => c.name))}` : ''}. Addresses, hours and directions, checked ${CHECKED}.`;
  const nearbyStates = state.center ? stateList.filter(s => s !== state && s.center)
    .map(s => ({ s, miles: haversineMiles(state.center, s.center) })).sort((a, b) => a.miles - b.miles).slice(0, 5) : [];
  const topCity = byCount[0];

  const faqs = [
    [`How many 7 Brew locations are in ${state.name}?`,
      `${state.name} has ${plural(n, '7 Brew stand', '7 Brew stands')} in ${plural(cities.length, 'city', 'cities')}, ranking #${state.rank} of the ${stateList.length} states with 7 Brew (official locator, checked ${CHECKED}).`],
  ];
  if (cities.length > 1) {
    const tied = byCount.filter(c => c.stands.length === topCity.stands.length);
    faqs.push([`Which city in ${state.name} has the most 7 Brew stands?`,
      tied.length === 1
        ? `${topCity.name} has the most, with ${plural(topCity.stands.length, 'stand', 'stands')}.`
        : `${listJoin(tied.map(c => c.name))} are tied for the most, with ${plural(topCity.stands.length, 'stand', 'stands')} each.`]);
  }
  faqs.push([`What are 7 Brew hours in ${state.name}?`, `${hoursSummary(state.stands, state.name)} Always check the hours for your stand before you go.`]);

  const body = `<p class="guide-eyebrow">Official directory snapshot · Checked ${CHECKED}</p>
<h1>7 Brew Locations in ${esc(state.name)} (${plural(n, 'Stand', 'Stands')})</h1>
<p class="guide-lead">${esc(state.name)} has ${plural(n, '7 Brew drive-thru stand', '7 Brew drive-thru stands')} across ${plural(cities.length, 'city', 'cities')} — #${state.rank} of the ${stateList.length} states with 7 Brew.${cities.length > 1 ? ` The most stands are in ${esc(listJoin(topCities.map(c => `${c.name} (${c.stands.length})`)))}.` : ''}</p>
<section><h2>7 Brew cities in ${esc(state.name)}</h2><ul class="guide-link-grid">
${cities.map(c => `<li><a href="${c.path}">${esc(c.name)}</a> (${c.stands.length})</li>`).join('\n')}
</ul></section>
<section><h2>All 7 Brew stands in ${esc(state.name)}</h2>
${cities.map(c => `<h3 id="${c.slug}" style="margin:28px 0 12px;">7 Brew ${esc(c.name)}, ${state.abbr}${c.hasPage ? ` · <a href="${c.path}" style="font-size:0.9rem;">City guide</a>` : ''}</h3>\n${standTable(c.stands)}`).join('\n')}
</section>
${nearbyStates.length ? `<section><h2>7 Brew in nearby states</h2><ul class="guide-link-grid">
${nearbyStates.map(({ s }) => `<li><a href="${s.path}">7 Brew ${esc(s.name)}</a> (${s.stands.length})</li>`).join('\n')}
</ul><p>Search every stand by city or ZIP in the <a href="/locations">nationwide 7 Brew locator</a>.</p></section>` : ''}
<section><h2>7 Brew ${esc(state.name)} FAQ</h2>
${faqDetails(faqs)}
</section>`;

  return page({
    urlPath: state.path,
    title, description,
    breadcrumbs: [{ name: 'Menu', path: '/' }, { name: 'Locations', path: '/locations' }, { name: state.name, path: state.path }],
    schema: [faqSchema(faqs), {
      '@type': 'ItemList', name: `7 Brew cities in ${state.name}`,
      itemListElement: cities.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: `7 Brew ${c.name}, ${state.abbr}`, url: SITE + c.path })),
    }],
    body,
  });
}

// ---------- write pages ----------
fs.rmSync(OUT_DIR, { recursive: true, force: true });
let cityPages = 0;
for (const state of stateList) {
  fs.mkdirSync(path.join(OUT_DIR, state.code), { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, `${state.code}.html`), buildState(state));
  for (const city of state.cities.values()) {
    if (!city.hasPage) continue;
    fs.writeFileSync(path.join(OUT_DIR, state.code, `${city.slug}.html`), buildCity(city));
    cityPages++;
  }
}

// ---------- generated blocks in existing files ----------
function replaceBlock(file, name, content) {
  const src = readText(file);
  const start = `<!-- LOCATIONS:${name}:START -->`, end = `<!-- LOCATIONS:${name}:END -->`;
  const i = src.indexOf(start), j = src.indexOf(end);
  if (i < 0 || j < i) throw new Error(`Markers ${name} missing in ${file}`);
  writeText(file, src.slice(0, i + start.length) + '\n' + content + '\n' + src.slice(j));
}

const topCitiesNational = [...allCities].sort((a, b) => b.stands.length - a.stands.length || a.name.localeCompare(b.name)).filter(c => c.hasPage).slice(0, 24);

replaceBlock('locations.html', 'STATE-COUNTS', (() => {
  const band = (lo, hi) => stateList.filter(s => s.stands.length >= lo && s.stands.length <= hi)
    .map(s => `<a href="${s.path}">${esc(s.name)}</a> (${s.stands.length})`).join(', ');
  return `<p style="margin-top:10px;">
<strong>50+ stands:</strong> ${band(50, Infinity)}<br/>
<strong>30–49 stands:</strong> ${band(30, 49)}<br/>
<strong>15–29 stands:</strong> ${band(15, 29)}<br/>
<strong>10–14 stands:</strong> ${band(10, 14)}<br/>
<strong>Under 10:</strong> ${band(1, 9)}
</p>`;
})());

replaceBlock('locations.html', 'BROWSE', `<section id="browse-by-state"><h2>Browse 7 Brew locations by state</h2><ul class="guide-link-grid">
${[...stateList].sort((a, b) => a.name.localeCompare(b.name)).map(s => `<li><a href="${s.path}">7 Brew ${esc(s.name)}</a> (${s.stands.length})</li>`).join('\n')}
</ul>
<p style="margin-top:14px;">7 Brew has no stands yet in ${(() => {
  const have = new Set(stateList.map(s => s.abbr));
  const missing = Object.entries(STATE_NAMES).filter(([abbr]) => !have.has(abbr)).map(([, name]) => name);
  return `${missing.length} states and territories, including ${listJoin(['California', 'Washington', 'Oregon', 'Nevada'].filter(n => missing.includes(n)))}`;
})()}. The chain is expanding from its Arkansas base outward, so the map changes month to month — we re-check the official locator and update these pages with it.</p></section>
<section id="popular-cities"><h2>Popular 7 Brew cities</h2><ul class="guide-link-grid">
${topCitiesNational.map(c => `<li><a href="${c.path}">7 Brew ${esc(c.name)}, ${c.state.abbr}</a> (${c.stands.length})</li>`).join('\n')}
</ul></section>`);

replaceBlock('index.html', 'HOME', `<p>Find a stand near you: browse 7 Brew locations in ${stateList.slice(0, 8).map(s => `<a href="${s.path}">${esc(s.name)}</a>`).join(', ')} and <a href="/locations#browse-by-state">${stateList.length - 8} more states</a>, or jump to popular cities like ${topCitiesNational.slice(0, 6).map(c => `<a href="${c.path}">${esc(c.name)}, ${c.state.abbr}</a>`).join(', ')}.</p>`);

replaceBlock('sitemap.xml', 'SITEMAP', [
  ...stateList.map(s => s.path),
  ...stateList.flatMap(s => [...s.cities.values()].filter(c => c.hasPage).map(c => c.path)),
].map(p => `  <url>\n    <loc>${SITE}${p}</loc>\n    <lastmod>${snapshot.checked}</lastmod>\n    <priority>0.6</priority>\n    <changefreq>monthly</changefreq>\n  </url>`).join('\n'));

// Keep the stand count and check date in sync everywhere they appear in prose,
// so a data refresh never leaves a stale number behind.
{
  const total = stands.length;
  const countRe = /\b(6|7|8|9)\d\d\b(?=(?:\+)?\s*(?:official\s+)?(?:7 Brew\s+)?(?:drive-thru\s+)?stands?\b|\s*Drive-Thru Stands|\s*stand pages|\s*stands in the published)/g;
  const dateRe = /\bChecked (?:January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2}, \d{4}\b/g;
  const checkedRe = /\bchecked (?:January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2}, \d{4}\b/g;
  let touched = 0;
  const files = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));
  for (const f of files) {
    const before = readText(f);
    let after = before.replace(countRe, String(total)).replace(dateRe, `Checked ${CHECKED}`).replace(checkedRe, `checked ${CHECKED}`);
    if (after !== before) { writeText(f, after); touched++; }
  }
  console.log(`Synced stand count (${total}) and check date (${CHECKED}) across ${touched} pages.`);
}

console.log(`Built ${stateList.length} state pages and ${cityPages} city pages from ${stands.length} stands (checked ${snapshot.checked}).`);
