#!/usr/bin/env node
// Builds the printable menu PDF the site offers for download.
//
//   node tools/build-menu-pdf.js
//
// Renders tools/menu-print.html (generated from js/menu-data.js and
// js/official-nutrition.js) to assets/7-brew-menu-prices.pdf using headless
// Chrome. Override the browser with CHROME=/path/to/chrome if needed.

'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const PRINT_HTML = path.join(__dirname, 'menu-print.html');
const PDF_OUT = path.join(ROOT, 'assets', '7-brew-menu-prices.pdf');

const CHROME_CANDIDATES = [
  process.env.CHROME,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean);

const ctx = { window: {}, document: {} };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'js/menu-data.js'), 'utf8') + ';globalThis.M=MENU_DATA;', ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'js/official-nutrition.js'), 'utf8') + ';globalThis.N=OFFICIAL_NUTRITION;', ctx);
const MENU = ctx.M;
const NUTRITION = ctx.N;

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const money = n => '$' + Number(n).toFixed(2);
const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

// Prices by category (estimates from menu-data)
const priceSections = MENU.categories
  .filter(c => c.id !== 'all')
  .map(cat => {
    const items = MENU.items.filter(i => i.category === cat.id && i.pricing);
    if (!items.length) return '';
    const rows = items.map(i =>
      `<tr><td>${esc(i.name)}</td><td class="n">${money(i.pricing.small)}</td><td class="n">${money(i.pricing.medium)}</td><td class="n">${money(i.pricing.large)}</td></tr>`).join('');
    return `<h2>${esc(cat.name)}</h2>
<table><thead><tr><th>Drink</th><th class="n">Small</th><th class="n">Medium</th><th class="n">Large</th></tr></thead><tbody>${rows}</tbody></table>`;
  }).join('\n');

// Official calories + caffeine, medium, first published preparation
const rows = new Map();
for (const r of NUTRITION) rows.set(`${r.name}|${r.temperature}|${r.size}`, r);
const TEMPS = ['Iced', 'Hot', 'Frozen Chiller'];
const nutritionRows = [...new Set(NUTRITION.map(r => r.name))]
  .sort((a, b) => a.localeCompare(b))
  .map(name => {
    const temp = TEMPS.find(t => rows.has(`${name}|${t}|medium`));
    if (!temp) return '';
    const r = rows.get(`${name}|${temp}|medium`);
    return `<tr><td>${esc(name)}</td><td class="n">${r.calories}</td><td class="n">${r.caffeine} mg</td><td class="n">${r.sugar} g</td><td>${temp === 'Frozen Chiller' ? 'Chiller' : temp}</td></tr>`;
  }).filter(Boolean).join('');

const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"/>
<title>7 Brew Menu with Prices (2026) — 7brewsmenuus.com</title>
<style>
  @page { size: letter; margin: 14mm 12mm 16mm; }
  * { box-sizing: border-box; }
  body { font-family: "Segoe UI", Arial, sans-serif; color: #0F172A; font-size: 10pt; margin: 0; }
  h1 { font-size: 22pt; margin: 0 0 4pt; letter-spacing: -0.5pt; }
  .sub { color: #475569; font-size: 9.5pt; margin-bottom: 10pt; }
  h2 { font-size: 12pt; margin: 14pt 0 5pt; padding-bottom: 3pt; border-bottom: 2px solid #EA0029; break-after: avoid; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 4pt; }
  th, td { text-align: left; padding: 3.2pt 4pt; border-bottom: 0.5pt solid #E2E8F0; }
  th { background: #F8FAFC; font-size: 8.5pt; text-transform: uppercase; letter-spacing: 0.4pt; color: #475569; }
  td.n, th.n { text-align: right; white-space: nowrap; }
  tr { break-inside: avoid; }
  .note { background: #F8FAFC; border-left: 3px solid #EA0029; padding: 7pt 9pt; font-size: 8.5pt; color: #334155; margin: 10pt 0; }
  .page-break { break-before: page; }
  footer { position: fixed; bottom: 4mm; left: 0; right: 0; font-size: 7.5pt; color: #64748B; text-align: center; }
</style></head><body>
<h1>7 Brew Menu with Prices</h1>
<div class="sub">Independent guide · 7brewsmenuus.com · Updated ${today}</div>
<div class="note"><strong>Prices are researched estimates, not official figures.</strong> Every 7 Brew is independently owned, so your local prices will differ. Calories and caffeine on page 2 come from 7 Brew's published nutrition guide. This guide is not affiliated with or endorsed by 7 Brew Coffee.</div>
${priceSections}
<div class="page-break"></div>
<h1>Official calories &amp; caffeine</h1>
<div class="sub">Medium size, from 7 Brew's published nutrition guide. Full tables by size at 7brewsmenuus.com/nutrition-calories</div>
<table><thead><tr><th>Drink</th><th class="n">Calories</th><th class="n">Caffeine</th><th class="n">Sugar</th><th>Prep</th></tr></thead><tbody>${nutritionRows}</tbody></table>
<footer>7brewsmenuus.com — independent 7 Brew menu guide · prices are estimates · not affiliated with 7 Brew Coffee</footer>
</body></html>
`;
fs.writeFileSync(PRINT_HTML, html);

const chrome = CHROME_CANDIDATES.find(p => fs.existsSync(p));
if (!chrome) {
  console.error('No Chrome found. Set CHROME=/path/to/chrome and re-run.');
  console.error('Print source written to', PRINT_HTML);
  process.exit(1);
}
const toWin = p => p.replace(/\\/g, '/');
execFileSync(chrome, [
  '--headless=new', '--disable-gpu', '--no-sandbox', '--no-pdf-header-footer',
  `--print-to-pdf=${toWin(PDF_OUT)}`,
  'file:///' + toWin(PRINT_HTML),
], { stdio: 'pipe', timeout: 120000 });

const size = fs.statSync(PDF_OUT).size;
if (size < 5000) throw new Error(`PDF looks empty (${size} bytes)`);
console.log(`built ${path.relative(ROOT, PDF_OUT)} (${(size / 1024).toFixed(0)} KB) from ${MENU.items.filter(i => i.pricing).length} priced items and ${new Set(NUTRITION.map(r => r.name)).size} nutrition rows`);
