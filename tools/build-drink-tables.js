#!/usr/bin/env node
// Builds the price / caffeine / calorie tables on /energy-drinks and /nutrition-calories.
//
//   node tools/build-drink-tables.js
//
// Calories, caffeine and sugar come from js/official-nutrition.js (7 Brew's published
// nutrition guide). Prices come from js/menu-data.js and are estimates.
// Output goes between the <!-- DRINKS:<name>:START/END --> markers in each page.

'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const SIZES = [['small', 'Small', '16 oz'], ['medium', 'Medium', '24 oz'], ['large', 'Large', '32 oz']];

const ctx = { window: {}, document: {} };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'js/official-nutrition.js'), 'utf8') + ';globalThis.N=OFFICIAL_NUTRITION;', ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'js/menu-data.js'), 'utf8') + ';globalThis.M=MENU_DATA;', ctx);
const NUTRITION = ctx.N;
const MENU = ctx.M;

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const money = n => '$' + n.toFixed(2);

// Some drinks have more than one published row for the same size/temperature.
// Keep every distinct value so the table can show a range instead of picking one.
const rows = new Map();
for (const r of NUTRITION) {
  const key = `${r.name}|${r.temperature}|${r.size}`;
  if (!rows.has(key)) rows.set(key, []);
  rows.get(key).push(r);
}
const get = (name, temp, size) => rows.get(`${name}|${temp}|${size}`) || [];
function range(name, temp, size, field, unit) {
  const vals = [...new Set(get(name, temp, size).map(r => r[field]).filter(v => v !== undefined && v !== null))].sort((a, b) => a - b);
  if (!vals.length) return '—';
  const text = vals.length === 1 ? `${vals[0]}` : `${vals[0]}–${vals[vals.length - 1]}`;
  return unit ? `${text} ${unit}` : text;
}
const has = (name, temp) => SIZES.some(([s]) => get(name, temp, s).length);
const names = [...new Set(NUTRITION.map(r => r.name))].sort((a, b) => a.localeCompare(b));

function table(headers, bodyRows) {
  return `<div class="guide-table"><table><thead><tr>${headers.map(h => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>
${bodyRows.map(cells => `<tr>${cells.map((c, i) => i === 0 ? `<th scope="row" style="font-weight:600;">${c}</th>` : `<td>${c}</td>`).join('')}</tr>`).join('\n')}
</tbody></table></div>`;
}

function replaceBlock(file, name, content) {
  const full = path.join(ROOT, file);
  const src = fs.readFileSync(full, 'utf8');
  const crlf = src.includes('\r\n');
  const flat = src.replace(/\r\n/g, '\n');
  const start = `<!-- DRINKS:${name}:START -->`, end = `<!-- DRINKS:${name}:END -->`;
  const i = flat.indexOf(start), j = flat.indexOf(end);
  if (i < 0 || j < i) throw new Error(`Markers ${name} missing in ${file}`);
  const out = flat.slice(0, i + start.length) + '\n' + content + '\n' + flat.slice(j);
  fs.writeFileSync(full, crlf ? out.replace(/\n/g, '\r\n') : out);
}

// ---------- energy drinks ----------
const energyNames = names.filter(n => /7 Energy$/.test(n) && !/^Sugar-Free/.test(n));
const energySF = names.filter(n => /7 Energy$/.test(n) && /^Sugar-Free/.test(n));
const across = (list, temp, size, field) => {
  const vals = list.flatMap(n => get(n, temp, size).map(r => r[field])).filter(v => v !== undefined);
  if (!vals.length) return null;
  return [Math.min(...vals), Math.max(...vals)];
};
const fmtRange = (pair, unit) => !pair ? '—' : (pair[0] === pair[1] ? `${pair[0]} ${unit}` : `${pair[0]}–${pair[1]} ${unit}`);

const caffeineRows = [];
for (const [key, label, oz] of SIZES) {
  caffeineRows.push([
    `${label} <span style="white-space:nowrap;">(${oz} iced)</span>`,
    fmtRange(across(energyNames, 'Iced', key, 'caffeine'), 'mg'),
    fmtRange(across(energyNames, 'Iced', key, 'calories'), 'cal'),
    fmtRange(across(energyNames, 'Iced', key, 'sugar'), 'g'),
    fmtRange(across(energySF, 'Iced', key, 'calories'), 'cal'),
  ]);
}
for (const [key, label] of SIZES) {
  const caff = across(energyNames, 'Frozen Chiller', key, 'caffeine');
  if (!caff) continue;
  caffeineRows.push([
    `${label} <span style="white-space:nowrap;">(frozen chiller)</span>`,
    fmtRange(caff, 'mg'),
    fmtRange(across(energyNames, 'Frozen Chiller', key, 'calories'), 'cal'),
    fmtRange(across(energyNames, 'Frozen Chiller', key, 'sugar'), 'g'),
    fmtRange(across(energySF, 'Frozen Chiller', key, 'calories'), 'cal'),
  ]);
}

const icedCaff = SIZES.map(([k]) => across(energyNames, 'Iced', k, 'caffeine')[0]);
replaceBlock('energy-drinks.html', 'CAFFEINE', `<h2 id="caffeine-by-size">7 Energy caffeine and calories by size</h2>
<p>These are the numbers in 7 Brew's published nutrition guide. Caffeine is the same across the 7 Energy flavors — what changes between flavors is sugar and calories. A small iced 7 Energy has about ${icedCaff[0]} mg of caffeine, a medium about ${icedCaff[1]} mg and a large about ${icedCaff[2]} mg.</p>
${table(['Size', 'Caffeine', 'Calories', 'Sugar', 'Sugar-free calories'], caffeineRows)}
<p>Sugar-free 7 Energy keeps the same caffeine but drops to roughly ${across(energySF, 'Iced', 'medium', 'calories')[0]}–${across(energySF, 'Iced', 'medium', 'calories')[1]} calories and 0 g of sugar in a medium, because the flavor syrups are swapped for sugar-free ones. Kids-size drinks are also on the menu and are not shown here.</p>
<p style="font-size:0.9rem;">Note: several third-party menu sites list 160–320 mg for these drinks. We publish the figures from the official nutrition guide instead. Recipes change, so check the current guide at <a href="https://7brew.com" rel="noopener">7brew.com</a> if you are tracking caffeine closely.</p>`);

const priceItems = MENU.items.filter(i => i.category === 'energy' && i.pricing);
const flavorPrice = priceItems.find(i => !/can/i.test(i.name));
const uniformPrice = priceItems.filter(i => !/can/i.test(i.name))
  .every(i => SIZES.every(([k]) => i.pricing[k] === flavorPrice.pricing[k]));
if (!uniformPrice) throw new Error('Energy flavor prices are no longer uniform — the price table needs updating');

replaceBlock('energy-drinks.html', 'PRICES', `<h2 id="prices-by-size">7 Brew energy drink prices by size</h2>
<p>How much is a medium 7 Brew energy drink? About ${money(flavorPrice.pricing.medium)} for a 24 oz medium, with a small around ${money(flavorPrice.pricing.small)} and a large around ${money(flavorPrice.pricing.large)}. Every 7 Energy flavor is priced the same, and sugar-free costs no extra.</p>
${table(['Item', 'Small (16 oz)', 'Medium (24 oz)', 'Large (32 oz)'], [
  ['Any 7 Energy flavor, iced', money(flavorPrice.pricing.small), money(flavorPrice.pricing.medium), money(flavorPrice.pricing.large)],
  ['Sugar-free 7 Energy', money(flavorPrice.pricing.small), money(flavorPrice.pricing.medium), money(flavorPrice.pricing.large)],
])}
<p style="font-size:0.9rem;">Prices are our estimates, not official figures: every stand is independently owned, so the price you pay varies by market, and add-ins such as extra syrups or a frozen chiller blend can cost more. Check the 7 Brew app for your stand's current menu prices. Looking for the ready-to-drink cans instead? See <a href="/canned-drinks-walmart">7 Brew canned drinks at Walmart</a>.</p>`);

const flavorRows = MENU.items.filter(i => i.category === 'energy' && !/can/i.test(i.name)).map(i => {
  const official = names.includes(i.name);
  const sfName = `Sugar-Free ${i.name}`;
  return [
    esc(i.name),
    esc(i.tagline || ''),
    official ? range(i.name, 'Iced', 'medium', 'calories', 'cal') : 'Not listed',
    official ? range(i.name, 'Iced', 'medium', 'sugar', 'g') : 'Not listed',
    names.includes(sfName) ? `Yes — ${range(sfName, 'Iced', 'medium', 'calories', 'cal')}` : 'Order sugar-free syrups',
  ];
});
replaceBlock('energy-drinks.html', 'FLAVORS', `<h2 id="flavors-nutrition">7 Energy flavors: calories and sugar in a medium</h2>
${table(['Flavor', 'Flavor mix', 'Calories (medium, iced)', 'Sugar', 'Sugar-free version'], flavorRows)}
<p style="font-size:0.9rem;">"Not listed" means the flavor is on the drive-thru board but does not appear in the published nutrition guide we work from; expect numbers close to the other flavors of the same size. Any flavor can be built with sugar-free syrups even when a pre-set sugar-free version is not listed.</p>`);

// ---------- nutrition & calories ----------
function menuTable(temp, note) {
  const list = names.filter(n => has(n, temp));
  const body = list.map(n => [
    esc(n),
    ...SIZES.map(([k]) => range(n, temp, k, 'calories')),
    range(n, temp, 'medium', 'caffeine', 'mg'),
  ]);
  return { count: list.length, html: `${note}\n${table(['Drink', 'Small', 'Medium', 'Large', 'Caffeine (medium)'], body)}` };
}
const iced = menuTable('Iced', '<h3 id="calories-iced">Iced drinks (16 / 24 / 32 oz)</h3>');
const hot = menuTable('Hot', '<h3 id="calories-hot">Hot drinks (12 / 16 / 20 oz)</h3>');
const chiller = menuTable('Frozen Chiller', '<h3 id="calories-chiller">Frozen chillers (16 / 24 / 32 oz)</h3>');

replaceBlock('nutrition-calories.html', 'CALORIE-MENU', `<h2 id="calories-menu">7 Brew calories menu: every drink by size</h2>
<p>Calories for all ${names.length} drinks in 7 Brew's published nutrition guide, including the sugar-free versions, listed alphabetically. Values are for the standard recipe: swapping milk, adding whipped topping or changing syrup pumps moves them. A dash means that size or temperature is not listed for the drink.</p>
${iced.html}
${hot.html}
${chiller.html}
<p style="font-size:0.9rem;">Kids sizes are published too and are not shown here. Where the guide lists more than one value for a drink, the table shows the range. Use the <a href="#nutritionCalculatorSection">calculator above</a> to build a custom drink.</p>`);

// Strongest drinks, straight from the guide (one entry per drink, largest size)
const strongest = [];
for (const n of names) {
  let best = null;
  for (const temp of ['Iced', 'Hot', 'Frozen Chiller']) {
    for (const [size] of SIZES) {
      for (const r of get(n, temp, size)) {
        if (!best || r.caffeine > best.caffeine) best = { ...r, temp };
      }
    }
  }
  if (best && best.caffeine) strongest.push(best);
}
strongest.sort((a, b) => b.caffeine - a.caffeine);
const sizeLabel = { small: 'Small', medium: 'Medium', large: 'Large' };
const tempLabel = { Iced: 'iced', Hot: 'hot', 'Frozen Chiller': 'frozen chiller' };
replaceBlock('nutrition-calories.html', 'HIGH-CAFFEINE', `<ol style="font-size:0.95rem; line-height:1.9; padding-left:20px; margin-bottom:32px;">
${strongest.slice(0, 8).map(r => `<li><strong>${sizeLabel[r.size]} ${esc(r.name)} (${tempLabel[r.temp]})</strong> — ${r.caffeine} mg caffeine, ${r.calories} cal</li>`).join('\n')}
</ol>
<p style="font-size:0.9rem;">Espresso-based drinks, not the energy menu, carry the most caffeine here: a large 7 Energy has about ${icedCaff[2]} mg, while a large frozen mocha reaches ${strongest[0].caffeine} mg. Adding shots raises any drink further.</p>`);

console.log(`energy-drinks: ${flavorRows.length} flavors, caffeine ${icedCaff.join('/')} mg.`);
console.log(`strongest drink: ${strongest[0].name} ${strongest[0].size} ${strongest[0].temp} ${strongest[0].caffeine} mg.`);
console.log(`nutrition-calories: ${names.length} drinks (${iced.count} iced, ${hot.count} hot, ${chiller.count} chiller).`);
