#!/usr/bin/env node
// Replace menu-data.js's blanket nutrition estimates with 7 Brew's published
// figures, and rewrite the homepage drink cards to match.
//
//   node tools/sync-card-nutrition.js
//
// Items with no published figures say so instead of carrying an estimate.

'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const MENU_FILE = path.join(ROOT, 'js/menu-data.js');
const INDEX = path.join(ROOT, 'index.html');

const ctx = { window: {}, document: {} };
vm.createContext(ctx);
const menuRaw = fs.readFileSync(MENU_FILE, 'utf8');
vm.runInContext(menuRaw + ';globalThis.M=MENU_DATA;', ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'js/official-nutrition.js'), 'utf8') + ';globalThis.N=OFFICIAL_NUTRITION;', ctx);
const M = ctx.M, N = ctx.N;

const names = [...new Set(N.map(r => r.name))];
const norm = s => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const byNorm = new Map(names.map(n => [norm(n), n]));

// Hand-checked aliases for menu names that differ from the guide's wording
const ALIASES = {
  'Pink Mermaid 7 Fizz': 'Pink Mermaid 7 Fizz Soda',
  'Brew Lagoon 7 Fizz': 'Brew Lagoon 7 Fizz Soda',
  'Blood Orange 7 Fizz': 'Blood Orange 7 Fizz Soda',
  "Peaches 'n' Cream 7 Fizz": "Peaches 'n Cream 7 Fizz Soda",
  'Spiced Chai Tea Latte': 'Chai Latte',
  'Iced Peach Black Tea': 'Georgia Peach Black Tea',
};
const SUFFIX = ['breve', 'mocha', 'latte', 'americano', 'cappuccino', 'macchiato', 'cold brew', '7 energy', '7 fizz soda', 'lemonade', 'tea', 'matcha latte'];

function officialNameFor(item) {
  if (ALIASES[item.name]) return ALIASES[item.name];
  const n = norm(item.name);
  if (byNorm.has(n)) return byNorm.get(n);
  for (const suf of SUFFIX) if (byNorm.has(`${n} ${suf}`)) return byNorm.get(`${n} ${suf}`);
  const stripped = n.replace(/^(classic|the|fresh|craft|iced|hot)\s+/, '').replace(/\s+(coffee|drip coffee|shake|smoothie|can)$/, '');
  if (byNorm.has(stripped)) return byNorm.get(stripped);
  for (const suf of SUFFIX) if (byNorm.has(`${stripped} ${suf}`)) return byNorm.get(`${stripped} ${suf}`);
  return null;
}

const rowFor = (name, temp, size) => N.find(r => r.name === name && r.temperature === temp && r.size === size);
function figuresFor(name) {
  const temp = ['Iced', 'Hot', 'Frozen Chiller'].find(t => rowFor(name, t, 'medium'));
  if (!temp) return null;
  const pull = field => ['small', 'medium', 'large'].reduce((o, s) => {
    const r = rowFor(name, temp, s);
    if (r) o[s] = r[field];
    return o;
  }, {});
  return { temp, calories: pull('calories'), caffeineMg: pull('caffeine') };
}

// ---- 1. menu-data.js ----
let synced = 0, cleared = 0;
for (const item of M.items) {
  const official = officialNameFor(item);
  const figures = official && figuresFor(official);
  if (figures) {
    item.calories = figures.calories;
    item.caffeineMg = figures.caffeineMg;
    item.nutritionSource = official;
    synced++;
  } else {
    delete item.calories;
    delete item.caffeineMg;
    delete item.nutritionSource;
    cleared++;
  }
}
M.metadata.nutritionNote = 'Calories and caffeine come from 7 Brew\'s published nutrition guide where the drink appears in it; drinks without published figures show none. Prices remain estimates.';
fs.writeFileSync(MENU_FILE, menuRaw.slice(0, menuRaw.indexOf('const MENU_DATA')) + 'const MENU_DATA = ' + JSON.stringify(M, null, 2) + ';\n');
console.log(`menu-data.js: ${synced} items synced to official figures, ${cleared} left without published figures`);

// ---- 2. homepage cards ----
const raw = fs.readFileSync(INDEX, 'utf8');
const crlf = raw.includes('\r\n');
let html = raw.replace(/\r\n/g, '\n');
let rewritten = 0, notPublished = 0, missed = [];

for (const item of M.items) {
  const anchor = `<button class="btn btn-outline btn-sm load-to-builder-btn" data-item-id="${item.id}">`;
  const at = html.indexOf(anchor);
  if (at < 0) continue;                      // item has no card on the homepage
  const metaStart = html.lastIndexOf('<div class="drink-card-meta">', at);
  if (metaStart < 0) { missed.push(item.name); continue; }
  const metaEnd = html.indexOf('</div>', metaStart);
  const block = html.slice(metaStart, metaEnd);
  const tail = block.slice(block.indexOf('<a href='));   // keep the trailing link

  let replacement;
  if (item.calories && item.caffeineMg) {
    replacement = `<span>${item.calories.medium} kcal · medium</span><span>${item.caffeineMg.medium} mg caffeine</span><small>7 Brew published nutrition guide</small>`;
    rewritten++;
  } else {
    replacement = `<span>Calories not published</span><span>Caffeine not published</span><small>Not in 7 Brew's nutrition guide</small>`;
    notPublished++;
  }
  html = html.slice(0, metaStart) + `<div class="drink-card-meta">\n${replacement}${tail}` + html.slice(metaEnd);
}

fs.writeFileSync(INDEX, crlf ? html.replace(/\n/g, '\r\n') : html);
console.log(`index.html: ${rewritten} cards now show official figures, ${notPublished} say not published`);
if (missed.length) console.log('  cards whose meta block was not found:', missed.join(', '));
if (/Illustrative recipe estimate/.test(html)) {
  console.log(`  NOTE: ${(html.match(/Illustrative recipe estimate/g) || []).length} "Illustrative recipe estimate" labels remain`);
}
