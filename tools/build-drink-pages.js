#!/usr/bin/env node
// Builds one page per drink from the official nutrition guide.
//
//   node tools/build-drink-pages.js
//
// Drinks listed in tools/drink-pages.json get a page at /<slug>.
// Calories, caffeine, sugar and macros come from js/official-nutrition.js;
// allergens from tools/drink-allergens.json (parsed from 7 Brew's PDF);
// prices are category estimates from js/menu-data.js and are labelled as such.

'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const SITE = 'https://7brewsmenuus.com';
const ASSET_VERSION = '20260912c';
const SIZES = [['small', 'Small'], ['medium', 'Medium'], ['large', 'Large']];
const TEMPS = [['Iced', 'Iced', '16 / 24 / 32 oz'], ['Hot', 'Hot', '12 / 16 / 20 oz'], ['Frozen Chiller', 'Frozen chiller', '16 / 24 / 32 oz']];

const ctx = { window: {}, document: {} };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'js/official-nutrition.js'), 'utf8') + ';globalThis.N=OFFICIAL_NUTRITION;', ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'js/menu-data.js'), 'utf8') + ';globalThis.M=MENU_DATA;', ctx);
const NUTRITION = ctx.N;
const MENU = ctx.M;
const ALLERGENS = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools/drink-allergens.json'), 'utf8'));
const DRINKS = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools/drink-pages.json'), 'utf8'));
const CHECKED = 'June 2026';
const REVIEWED = new Date().toISOString().slice(0, 10);
const REVIEWED_LABEL = new Date(REVIEWED + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const slugify = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  .replace(/'/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const money = n => '$' + n.toFixed(2);
const listJoin = a => a.length <= 1 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1];

const rows = new Map();
for (const r of NUTRITION) {
  const k = `${r.name}|${r.temperature}|${r.size}`;
  if (!rows.has(k)) rows.set(k, []);
  rows.get(k).push(r);
}
const get = (name, temp, size) => rows.get(`${name}|${temp}|${size}`) || [];
function val(name, temp, size, field) {
  const vs = [...new Set(get(name, temp, size).map(r => r[field]).filter(v => v !== undefined && v !== null))];
  if (!vs.length) return null;
  return vs.length === 1 ? vs[0] : `${Math.min(...vs)}–${Math.max(...vs)}`;
}
const has = (name, temp) => SIZES.some(([s]) => get(name, temp, s).length);
const officialNames = new Set(NUTRITION.map(r => r.name));

// ---------- category, prices, siblings ----------
const CATEGORIES = [
  { id: 'energy', test: /7 Energy$/, label: '7 Energy', hub: '/energy-drinks', hubLabel: '7 Energy drinks' },
  { id: 'fizz', test: /7 Fizz Soda$/, label: '7 Fizz soda', hub: '/fizz-drinks', hubLabel: '7 Fizz sodas' },
  { id: 'lemonades', test: /Lemonade$/, label: 'lemonade', hub: '/lemonades', hubLabel: 'lemonades' },
  { id: 'teas-matcha', test: /Matcha Latte$/, label: 'matcha latte', hub: '/matcha', hubLabel: 'matcha drinks' },
  { id: 'teas-matcha', test: /(Tea|Chai|Chai Latte)$/, label: 'tea or chai', hub: '/teas-chai', hubLabel: 'teas and chai' },
  { id: 'smoothies', test: /Smoothie$/, label: 'smoothie', hub: '/smoothies-shakes', hubLabel: 'smoothies and shakes' },
  { id: 'shakes', test: /Shake$/, label: 'shake', hub: '/smoothies-shakes', hubLabel: 'smoothies and shakes' },
  { id: 'classics', test: /(Americano|Cappuccino|Cold Brew|Latte|Mocha|Macchiato)$/, label: 'classic espresso drink', hub: '/', hubLabel: 'full menu' },
  { id: 'originals', test: /Breve$/, label: '7 Original breve', hub: '/', hubLabel: 'full menu' },
];
const categoryOf = name => CATEGORIES.find(c => c.test.test(name)) ||
  { id: 'classics', label: 'drink', hub: '/', hubLabel: 'full menu' };

const priceByCategory = {};
for (const cat of MENU.categories) {
  const items = MENU.items.filter(i => i.category === cat.id && i.pricing);
  if (!items.length) continue;
  const med = arr => [...arr].sort((a, b) => a - b)[Math.floor(arr.length / 2)];
  priceByCategory[cat.id] = {
    small: med(items.map(i => i.pricing.small)),
    medium: med(items.map(i => i.pricing.medium)),
    large: med(items.map(i => i.pricing.large)),
  };
}
const priceFor = catId => priceByCategory[catId] || priceByCategory.classics;

function table(headers, body) {
  return `<div class="guide-table"><table><thead><tr>${headers.map(h => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>
${body.map(cells => `<tr>${cells.map((c, i) => i === 0 ? `<th scope="row" style="font-weight:600;">${c}</th>` : `<td>${c}</td>`).join('')}</tr>`).join('\n')}
</tbody></table></div>`;
}
const faqDetails = faqs => faqs.map(([q, a]) =>
  `<details style="background:var(--card-bg, #f8f5f0); border:1px solid var(--border, #e0dcd5); border-radius:10px; padding:14px 18px; margin-bottom:10px;"><summary style="cursor:pointer; font-weight:600;">${esc(q)}</summary><p style="margin-top:8px;">${esc(a)}</p></details>`).join('\n');

// ---------- page chrome, taken from an existing guide page ----------
const sample = fs.readFileSync(path.join(ROOT, 'blondie.html'), 'utf8').replace(/\r\n/g, '\n');
const HEADER = sample.slice(sample.indexOf('<body>') + 6, sample.indexOf('<main'));
const FOOTER = sample.slice(sample.indexOf('</main>') + 7, sample.indexOf('</body>'));
if (!HEADER.includes('site-header') || !FOOTER.includes('site-footer')) throw new Error('could not extract chrome from blondie.html');

function buildDrink(name) {
  const cat = categoryOf(name);
  const slug = slugify(name);
  const url = `${SITE}/${slug}`;
  const sfName = `Sugar-Free ${name}`;
  const hasSF = officialNames.has(sfName);
  const allergens = ALLERGENS[name];
  const price = priceFor(cat.id);
  const temps = TEMPS.filter(([t]) => has(name, t));
  const mainTemp = temps.length ? temps[0][0] : 'Iced';
  const medCal = val(name, mainTemp, 'medium', 'calories');
  const medCaf = val(name, mainTemp, 'medium', 'caffeine');
  const medSugar = val(name, mainTemp, 'medium', 'sugar');

  // Keep titles inside what Google shows (~60 chars), trimming the least useful part first
  const titleOptions = [
    `7 Brew ${name}: Price, Calories & Caffeine (2026)`,
    `7 Brew ${name}: Price, Calories & Caffeine`,
    `7 Brew ${name}: Calories & Price (2026)`,
    `7 Brew ${name}: Calories & Price`,
  ];
  const title = titleOptions.find(t => t.length <= 60) || titleOptions[titleOptions.length - 1];
  const description = `7 Brew ${name}: about ${money(price.medium)} for a medium, ${medCal} calories and ${medCaf} mg of caffeine, from the official nutrition guide. Sizes, macros${allergens ? ', allergens' : ''} and how to order.`;

  // Nutrition by temperature
  const nutritionSections = temps.map(([temp, label, oz]) => {
    const body = SIZES.filter(([s]) => get(name, temp, s).length).map(([s, sLabel]) => [
      sLabel,
      `${val(name, temp, s, 'calories')}`,
      `${val(name, temp, s, 'caffeine')} mg`,
      `${val(name, temp, s, 'sugar')} g`,
      `${val(name, temp, s, 'carbs')} g`,
      `${val(name, temp, s, 'fat')} g`,
      `${val(name, temp, s, 'protein')} g`,
    ]);
    return `<h3>${label} (${oz})</h3>
${table(['Size', 'Calories', 'Caffeine', 'Sugar', 'Carbs', 'Fat', 'Protein'], body)}`;
  }).join('\n');

  // Only compare against a preparation both versions are published for
  const sfTemp = hasSF ? temps.map(t => t[0]).find(t => has(sfName, t) && get(sfName, t, 'medium').length) : null;
  const sfSection = !hasSF ? '' : sfTemp ? `<section><h2>Is there a sugar-free ${esc(name)}?</h2>
<p>Yes — 7 Brew lists a sugar-free version built with sugar-free syrups. Comparing mediums (${TEMPS.find(t => t[0] === sfTemp)[1].toLowerCase()}):</p>
${table(['Version', 'Calories', 'Sugar', 'Carbs', 'Caffeine'], [
    [esc(name), `${val(name, sfTemp, 'medium', 'calories')}`, `${val(name, sfTemp, 'medium', 'sugar')} g`, `${val(name, sfTemp, 'medium', 'carbs')} g`, `${val(name, sfTemp, 'medium', 'caffeine')} mg`],
    [`Sugar-free ${esc(name)}`, `${val(sfName, sfTemp, 'medium', 'calories')}`, `${val(sfName, sfTemp, 'medium', 'sugar')} g`, `${val(sfName, sfTemp, 'medium', 'carbs')} g`, `${val(sfName, sfTemp, 'medium', 'caffeine')} mg`],
  ])}
<p>Caffeine does not change — only the syrup does. See every sugar-free option in the <a href="/syrups-flavors">customization guide</a>.</p></section>`
    : `<section><h2>Is there a sugar-free ${esc(name)}?</h2>
<p>Yes — 7 Brew lists a sugar-free ${esc(name)} built with sugar-free syrups, though the guide publishes it for a different preparation than the one above, so the two are not directly comparable. Any drink can also be made with <a href="/syrups-flavors">sugar-free syrups</a> on request.</p></section>`;

  const allergenSection = `<section><h2>${esc(name)} allergens</h2>
<p>${allergens
    ? `7 Brew's published allergen guide lists <strong>${esc(allergens)}</strong> for the ${esc(name)}.`
    : `7 Brew's published allergen guide lists <strong>no declared allergens</strong> for the standard ${esc(name)}.`} Adding a milk, syrup or topping changes this, and every drink is made on shared equipment, so cross-contact is possible.</p>
<p>If you are ordering around an allergy, check the <a href="/allergen-dietary-guide">full allergen and dietary guide</a> and confirm at the window.</p></section>`;

  // Related drinks in the same category
  const siblings = DRINKS.filter(d => d !== name && categoryOf(d).id === cat.id).slice(0, 6);

  const faqs = [
    [`How many calories are in a 7 Brew ${name}?`,
      `A medium ${temps.length ? temps[0][1].toLowerCase() : ''} ${name} has ${medCal} calories. A small has ${val(name, mainTemp, 'small', 'calories')} and a large ${val(name, mainTemp, 'large', 'calories')}, according to 7 Brew's nutrition guide.`],
    [`How much caffeine is in a 7 Brew ${name}?`,
      `About ${medCaf} mg in a medium. Small is ${val(name, mainTemp, 'small', 'caffeine')} mg and large is ${val(name, mainTemp, 'large', 'caffeine')} mg.`],
    [`How much does a 7 Brew ${name} cost?`,
      `Roughly ${money(price.small)} for a small, ${money(price.medium)} for a medium and ${money(price.large)} for a large. Prices are our estimates and vary by stand — every 7 Brew is independently owned.`],
    [`How much sugar is in a 7 Brew ${name}?`,
      `${medSugar} g in a medium${sfTemp ? `, or ${val(sfName, sfTemp, 'medium', 'sugar')} g if you order the sugar-free version` : ''}.`],
  ];

  const body = `<p class="guide-eyebrow">Official nutrition guide (${CHECKED}) · Reviewed ${REVIEWED_LABEL}</p>
<h1>7 Brew ${esc(name)}: Price, Calories &amp; Caffeine</h1>
<p class="guide-lead">A medium ${esc(name)} is about ${money(price.medium)}, with <strong>${medCal} calories</strong>, <strong>${medCaf} mg of caffeine</strong> and ${medSugar} g of sugar. Every number here comes from 7 Brew's own published nutrition guide, broken out by size and preparation.</p>

<section><h2>${esc(name)} at a glance</h2>
${table(['', 'Small', 'Medium', 'Large'], [
    ['Price (estimate)', money(price.small), money(price.medium), money(price.large)],
    ['Calories', `${val(name, mainTemp, 'small', 'calories')}`, `${medCal}`, `${val(name, mainTemp, 'large', 'calories')}`],
    ['Caffeine', `${val(name, mainTemp, 'small', 'caffeine')} mg`, `${medCaf} mg`, `${val(name, mainTemp, 'large', 'caffeine')} mg`],
    ['Sugar', `${val(name, mainTemp, 'small', 'sugar')} g`, `${medSugar} g`, `${val(name, mainTemp, 'large', 'sugar')} g`],
  ])}
<p style="font-size:0.9rem;">Calories, caffeine and sugar are from the official guide. Prices are researched estimates for a ${esc(cat.label)} and vary by market.</p></section>

<section><h2>${esc(name)} calories and full nutrition by size</h2>
<p>7 Brew publishes ${temps.length === 1 ? 'one preparation' : `${temps.length} preparations`} for this drink. Macros below are per drink, as served.</p>
${nutritionSections}
<p style="font-size:0.9rem;">Kids sizes are also published and not shown here. A range means the guide lists more than one value for that size.</p></section>

${sfSection}

${allergenSection}

<section><h2>How to order a ${esc(name)}</h2>
<p>Ask for it by name — it is on the standard board at every 7 Brew, so no special script is needed. Say the size first, then the drink: <em>"Can I get a medium ${esc(name)}?"</em></p>
<p>Worth knowing before you order: the base is customisable. You can swap milk, ask for <a href="/syrups-flavors">sugar-free syrups</a>, change the sweetness level, or have most drinks made iced, hot or blended as a frozen chiller where the menu allows. Ordering through the app earns <a href="/app-rewards">100 rewards points</a> either way.</p></section>

<section><h2>Related 7 Brew drinks</h2>
<ul class="guide-link-grid">
${siblings.map(s => `<li><a href="/${slugify(s)}">7 Brew ${esc(s)}</a></li>`).join('\n')}
<li><a href="${cat.hub}">All ${esc(cat.hubLabel)}</a></li>
<li><a href="/nutrition-calories">Every drink's calories by size</a></li>
</ul></section>

<section><h2>7 Brew ${esc(name)} FAQ</h2>
${faqDetails(faqs)}
</section>`;

  const graph = [
    { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: title, description, dateModified: REVIEWED, isPartOf: { '@id': `${SITE}/#website` } },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Menu', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'Drink guides', item: `${SITE}/guides` },
      { '@type': 'ListItem', position: 3, name: `7 Brew ${name}`, item: url }] },
    { '@type': 'MenuItem', name: `7 Brew ${name}`, url,
      offers: { '@type': 'Offer', priceCurrency: 'USD', price: price.medium.toFixed(2), description: 'Estimated medium price; varies by stand' },
      nutrition: {
        '@type': 'NutritionInformation',
        servingSize: 'Medium (24 fl oz)',
        calories: `${medCal} calories`,
        sugarContent: `${medSugar} g`,
        carbohydrateContent: `${val(name, mainTemp, 'medium', 'carbs')} g`,
        fatContent: `${val(name, mainTemp, 'medium', 'fat')} g`,
        proteinContent: `${val(name, mainTemp, 'medium', 'protein')} g`,
      },
      ...(allergens ? { suitableForDiet: [] } : {}) },
    { '@type': 'FAQPage', mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
  ];
  const ld = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');

  return { slug, title, description, html: `<!DOCTYPE html>
<!-- generated by tools/build-drink-pages.js -->

<html lang="en"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1" name="viewport"/><title>${esc(title)}</title><meta content="${esc(description)}" name="description"/><link href="${url}" rel="canonical"/><meta content="${esc(title)}" property="og:title"/><meta content="${esc(description)}" property="og:description"/><meta content="${url}" property="og:url"/><meta content="article" property="og:type"/><meta content="summary_large_image" name="twitter:card"/><meta content="${esc(title)}" name="twitter:title"/><meta content="${esc(description)}" name="twitter:description"/><meta content="${SITE}/assets/products/category-classics.webp" property="og:image"/><meta content="7 Brew drinks" property="og:image:alt"/><meta content="640" property="og:image:width"/><meta content="640" property="og:image:height"/><link href="css/styles.css?v=${ASSET_VERSION}" rel="stylesheet"/><link href="css/modern.css?v=${ASSET_VERSION}" rel="stylesheet"/><link href="assets/favicon.svg" rel="icon" type="image/svg+xml"/><link href="favicon.ico" rel="alternate icon" type="image/x-icon"/><link href="assets/apple-touch-icon.png" rel="apple-touch-icon"/><script type="application/ld+json">${ld}</script></head><body>${HEADER}<main class="research-guide container"><nav aria-label="Breadcrumb"><a href="/">Menu</a> / <a href="/guides">Drink guides</a> / ${esc(name)}</nav><article>
${body}
<div class="guide-note">This independent guide is not operated or endorsed by 7 Brew. Nutrition figures come from 7 Brew's published guide (${CHECKED}); prices are estimates and vary by stand. <a href="/about#sources">Sources</a>.</div>
</article></main>${FOOTER}</body></html>
` };
}

// ---------- write ----------
const built = [];
for (const name of DRINKS) {
  const page = buildDrink(name);
  const file = path.join(ROOT, `${page.slug}.html`);
  // Never clobber a hand-written page: only overwrite our own output.
  if (fs.existsSync(file) && !fs.readFileSync(file, 'utf8').includes('generated by tools/build-drink-pages.js')) {
    console.warn(`skipping ${page.slug}: a hand-written page already exists`);
    continue;
  }
  fs.writeFileSync(file, page.html.replace(/\n/g, '\r\n'));
  built.push(page);
}

// ---------- /teas-chai hub ----------
{
  const teaNames = [...officialNames]
    .filter(n => !/^Sugar-Free/.test(n) && /(Tea|Chai|Chai Latte|Matcha Latte)$/.test(n))
    .sort((a, b) => a.localeCompare(b));
  const price = priceFor('teas-matcha');
  const url = `${SITE}/teas-chai`;
  const title = '7 Brew Teas, Chai & Matcha: Prices, Calories & Caffeine';
  const description = `Every 7 Brew tea, chai and matcha drink — ${teaNames.length} of them — with calories, caffeine and prices by size, from the official nutrition guide.`;
  const body = teaNames.map(n => {
    const temp = TEMPS.map(t => t[0]).find(t => has(n, t)) || 'Iced';
    const linked = DRINKS.includes(n) ? `<a href="/${slugify(n)}">${esc(n)}</a>` : esc(n);
    return [linked, `${val(n, temp, 'medium', 'calories')}`, `${val(n, temp, 'medium', 'caffeine')} mg`, `${val(n, temp, 'medium', 'sugar')} g`, ALLERGENS[n] ? esc(ALLERGENS[n]) : 'None declared'];
  });
  const faqs = [
    ['Which 7 Brew tea has the most caffeine?', (() => {
      const best = teaNames.map(n => ({ n, c: Number(String(val(n, TEMPS.map(t => t[0]).find(t => has(n, t)) || 'Iced', 'medium', 'caffeine')).split('–')[0]) }))
        .filter(x => !Number.isNaN(x.c)).sort((a, b) => b.c - a.c)[0];
      return best ? `${best.n}, at about ${best.c} mg in a medium.` : 'Black tea is the strongest of the brewed teas.';
    })()],
    ['Does 7 Brew have caffeine-free tea?', 'Yes — the decaf tea is the caffeine-free brewed option, and the fruit-based lemonades and fizz sodas contain no caffeine either.'],
    ['Can 7 Brew teas be made sugar-free?', 'Yes. Teas and chais can be built with sugar-free syrups, and the guide publishes sugar-free versions of most flavoured teas. See the customization guide.'],
  ];
  const graph = [
    { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: title, description, dateModified: REVIEWED, isPartOf: { '@id': `${SITE}/#website` } },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Menu', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'Drink guides', item: `${SITE}/guides` },
      { '@type': 'ListItem', position: 3, name: 'Teas, chai & matcha', item: url }] },
    { '@type': 'FAQPage', mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
  ];
  const html = `<!DOCTYPE html>
<!-- generated by tools/build-drink-pages.js -->

<html lang="en"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1" name="viewport"/><title>${esc(title)}</title><meta content="${esc(description)}" name="description"/><link href="${url}" rel="canonical"/><meta content="${esc(title)}" property="og:title"/><meta content="${esc(description)}" property="og:description"/><meta content="${url}" property="og:url"/><meta content="article" property="og:type"/><meta content="summary_large_image" name="twitter:card"/><meta content="${esc(title)}" name="twitter:title"/><meta content="${esc(description)}" name="twitter:description"/><meta content="${SITE}/assets/products/category-teas-chai--matcha.webp" property="og:image"/><meta content="7 Brew teas, chai and matcha" property="og:image:alt"/><meta content="640" property="og:image:width"/><meta content="640" property="og:image:height"/><link href="css/styles.css?v=${ASSET_VERSION}" rel="stylesheet"/><link href="css/modern.css?v=${ASSET_VERSION}" rel="stylesheet"/><link href="assets/favicon.svg" rel="icon" type="image/svg+xml"/><link href="favicon.ico" rel="alternate icon" type="image/x-icon"/><link href="assets/apple-touch-icon.png" rel="apple-touch-icon"/><script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')}</script></head><body>${HEADER}<main class="research-guide container"><nav aria-label="Breadcrumb"><a href="/">Menu</a> / <a href="/guides">Drink guides</a> / Teas, chai &amp; matcha</nav><article>
<p class="guide-eyebrow">Official nutrition guide (${CHECKED}) · Reviewed ${REVIEWED_LABEL}</p>
<h1>7 Brew Teas, Chai &amp; Matcha: Prices, Calories &amp; Caffeine</h1>
<p class="guide-lead">7 Brew publishes ${teaNames.length} teas, chais and matcha drinks. A medium runs about ${money(price.medium)}, and the numbers below — calories, caffeine, sugar and allergens — come straight from the official nutrition guide.</p>

<section><h2>Every 7 Brew tea, chai and matcha drink</h2>
${table(['Drink', 'Calories (medium)', 'Caffeine', 'Sugar', 'Allergens'], body)}
<p style="font-size:0.9rem;">Medium is 24 oz iced or 16 oz hot depending on the drink. Where the guide lists more than one value for a size, the range is shown.</p></section>

<section><h2>Prices</h2>
<p>Teas, chais and matcha lattes are priced as one group: about ${money(price.small)} for a small, ${money(price.medium)} for a medium and ${money(price.large)} for a large. Prices are researched estimates and vary by stand.</p>
<p>The brewed teas — <a href="/black-tea">black</a>, <a href="/green-tea">green</a>, <a href="/earl-grey-tea">Earl Grey</a>, <a href="/paris-tea">Paris</a>, <a href="/cinnamon-spice-tea">cinnamon spice</a> and <a href="/decaf-tea">decaf</a> — can be ordered plain or built with flavour syrups. The chai and matcha drinks are milk-based, so they carry more calories.</p></section>

<section><h2>Teas, chai and matcha FAQ</h2>
${faqDetails(faqs)}
</section>

<section><h2>More 7 Brew guides</h2><ul class="guide-link-grid">
<li><a href="/nutrition-calories">Every drink's calories by size</a></li>
<li><a href="/sizes-caffeine">Cup sizes and caffeine</a></li>
<li><a href="/energy-drinks">7 Energy drinks</a></li>
<li><a href="/lemonades">Lemonades</a></li>
<li><a href="/matcha">Matcha guide</a></li>
<li><a href="/syrups-flavors">Syrups and sugar-free swaps</a></li>
</ul></section>

<div class="guide-note">This independent guide is not operated or endorsed by 7 Brew. Nutrition figures come from 7 Brew's published guide (${CHECKED}); prices are estimates and vary by stand. <a href="/about#sources">Sources</a>.</div>
</article></main>${FOOTER}</body></html>
`;
  fs.writeFileSync(path.join(ROOT, 'teas-chai.html'), html.replace(/\n/g, '\r\n'));
  built.push({ slug: 'teas-chai', title, description });
  console.log(`built /teas-chai hub with ${teaNames.length} drinks`);
}

// ---------- keep hub link lists in sync ----------
{
  const existingPages = { 'Blondie Breve': 'blondie', 'Brunette Mocha': 'brunette', 'Smooth 7 Breve': 'smooth-7', 'Cookie Butter Breve': 'cookie-butter', 'Banana Bread Mocha': 'banana-bread', 'Matcha Latte': 'matcha' };
  const linkFor = n => existingPages[n] ? `/${existingPages[n]}` : DRINKS.includes(n) ? `/${slugify(n)}` : null;
  const allDrinks = [...new Set([...DRINKS, ...Object.keys(existingPages)])].sort((a, b) => a.localeCompare(b));

  const blocks = {
    ALL: { heading: 'Every 7 Brew drink, page by page',
      intro: `Individual guides with price, calories, caffeine, macros and allergens for ${allDrinks.length} drinks, all from the official nutrition guide.`,
      items: allDrinks },
    energy: { heading: 'Every 7 Energy flavour', intro: 'Per-flavour pages with the official caffeine, calorie and sugar numbers.',
      items: allDrinks.filter(n => /7 Energy$/.test(n)) },
    fizz: { heading: 'Every 7 Fizz soda', intro: 'Per-flavour pages with calories, sugar and prices by size.',
      items: allDrinks.filter(n => /7 Fizz Soda$/.test(n)) },
    lemonades: { heading: 'Every 7 Brew lemonade', intro: 'Per-flavour pages with calories, sugar and prices by size.',
      items: allDrinks.filter(n => /Lemonade$/.test(n)) },
    'teas-matcha': { heading: 'Matcha, chai and tea drinks', intro: 'Per-drink pages with calories, caffeine and allergens.',
      items: allDrinks.filter(n => /(Matcha Latte|Chai Latte|Chai|Tea)$/.test(n)) },
  };

  for (const [key, block] of Object.entries(blocks)) {
    const file = { ALL: 'guides.html', energy: 'energy-drinks.html', fizz: 'fizz-drinks.html', lemonades: 'lemonades.html', 'teas-matcha': 'matcha.html' }[key];
    const full = path.join(ROOT, file);
    if (!fs.existsSync(full)) continue;
    const raw = fs.readFileSync(full, 'utf8');
    const crlf = raw.includes('\r\n');
    const flat = raw.replace(/\r\n/g, '\n');
    const start = `<!-- DRINKS:INDEX:${key}:START -->`, end = `<!-- DRINKS:INDEX:${key}:END -->`;
    const i = flat.indexOf(start), j = flat.indexOf(end);
    if (i < 0 || j < 0) { console.warn(`no ${key} markers in ${file}`); continue; }
    const links = block.items.map(n => { const href = linkFor(n); return href ? `<li><a href="${href}">7 Brew ${esc(n)}</a></li>` : null; }).filter(Boolean);
    const html = `<section><h2>${esc(block.heading)}</h2><p>${esc(block.intro)}</p><ul class="guide-link-grid">
${links.join('\n')}
${key === 'teas-matcha' ? '<li><a href="/teas-chai">All teas, chai &amp; matcha</a></li>' : ''}
</ul></section>`;
    const out = flat.slice(0, i + start.length) + '\n' + html + '\n' + flat.slice(j);
    fs.writeFileSync(full, crlf ? out.replace(/\n/g, '\r\n') : out);
    console.log(`${file}: ${links.length} drink links`);
  }
}

// sitemap
const SITEMAP = path.join(ROOT, 'sitemap.xml');
let sm = fs.readFileSync(SITEMAP, 'utf8');
const crlf = sm.includes('\r\n');
sm = sm.replace(/\r\n/g, '\n');
const marker = '<!-- DRINKS:SITEMAP:START -->';
const endMarker = '<!-- DRINKS:SITEMAP:END -->';
const entries = built.map(p => `  <url>\n    <loc>${SITE}/${p.slug}</loc>\n    <lastmod>${REVIEWED}</lastmod>\n    <priority>0.7</priority>\n    <changefreq>monthly</changefreq>\n  </url>`).join('\n');
if (sm.includes(marker)) {
  sm = sm.slice(0, sm.indexOf(marker) + marker.length) + '\n' + entries + '\n' + sm.slice(sm.indexOf(endMarker));
} else {
  sm = sm.replace('</urlset>', `${marker}\n${entries}\n${endMarker}\n</urlset>`);
}
fs.writeFileSync(SITEMAP, crlf ? sm.replace(/\n/g, '\r\n') : sm);

console.log(`built ${built.length} drink pages`);
console.log('slugs:', built.map(p => p.slug).join(', '));
