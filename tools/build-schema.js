#!/usr/bin/env node
// Structured data for the hand-written pages.
//
//   node tools/build-schema.js
//
// Adds, between <!-- SCHEMA:SITE --> markers in <head>:
//   * Organization + WebSite  — every page references isPartOf #website, but
//     only the homepage used to define it, so the reference dangled
//   * Menu > MenuSection > MenuItem with offers and published nutrition, on
//     the category pages
//   * FAQPage built from the visible FAQ accordions, where one is missing
//
// Generated pages (drinks, locations, hours, deals) carry their own graphs.

'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const SITE = 'https://7brewsmenuus.com';

const ctx = { window: {}, document: {} };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'js/menu-data.js'), 'utf8') + ';globalThis.M=MENU_DATA;', ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'js/official-nutrition.js'), 'utf8') + ';globalThis.N=OFFICIAL_NUTRITION;', ctx);
const MENU = ctx.M, NUTRITION = ctx.N;

// ---------- shared site entity ----------
const ORG = {
  '@type': 'Organization',
  '@id': `${SITE}/#organization`,
  name: '7 Brew Menu Guide USA',
  url: SITE,
  description: 'Independent consumer guide to the 7 Brew Coffee drive-thru menu, prices, nutrition and stand locations in the United States. Not affiliated with 7 Brew Coffee.',
  logo: { '@type': 'ImageObject', url: `${SITE}/assets/apple-touch-icon.png`, width: 180, height: 180 },
};
const WEBSITE = {
  '@type': 'WebSite',
  '@id': `${SITE}/#website`,
  name: '7 Brew Menu Guide USA',
  url: SITE,
  publisher: { '@id': ORG['@id'] },
  inLanguage: 'en-US',
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${SITE}/locations?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
};

// ---------- category pages ----------
// page -> menu-data categories shown on it
const CATEGORY_PAGES = {
  'energy-drinks.html': { cats: ['energy'], name: '7 Brew 7 Energy drinks', url: `${SITE}/energy-drinks` },
  'fizz-drinks.html': { cats: ['fizz'], name: '7 Brew 7 Fizz sodas', url: `${SITE}/fizz-drinks` },
  'lemonades.html': { cats: ['lemonades'], name: '7 Brew lemonades', url: `${SITE}/lemonades` },
  'smoothies-shakes.html': { cats: ['smoothies', 'shakes'], name: '7 Brew smoothies and shakes', url: `${SITE}/smoothies-shakes` },
  'secret-menu.html': { cats: ['secret-menu'], name: '7 Brew secret menu', url: `${SITE}/secret-menu` },
  'seasonal-drinks.html': { cats: ['seasonal'], name: '7 Brew seasonal drinks', url: `${SITE}/seasonal-drinks` },
  'matcha.html': { cats: ['teas-matcha'], name: '7 Brew matcha, tea and chai', url: `${SITE}/matcha` },
};

const rowFor = (name, temp, size) => NUTRITION.find(r => r.name === name && r.temperature === temp && r.size === size);
function nutritionNode(item) {
  if (!item.nutritionSource || !item.calories) return null;
  const name = item.nutritionSource;
  const temp = ['Iced', 'Hot', 'Frozen Chiller'].find(t => rowFor(name, t, 'medium'));
  const r = temp && rowFor(name, temp, 'medium');
  if (!r) return null;
  return {
    '@type': 'NutritionInformation',
    servingSize: 'Medium',
    calories: `${r.calories} calories`,
    carbohydrateContent: `${r.carbs} g`,
    sugarContent: `${r.sugar} g`,
    fatContent: `${r.fat} g`,
    proteinContent: `${r.protein} g`,
    fiberContent: `${r.fiber} g`,
  };
}

function menuItemNode(item, pageUrl) {
  const node = {
    '@type': 'MenuItem',
    name: item.name,
    url: pageUrl,
    ...(item.tagline ? { description: item.tagline } : {}),
  };
  if (item.pricing) {
    node.offers = ['small', 'medium', 'large'].filter(s => item.pricing[s]).map(s => ({
      '@type': 'Offer',
      name: s.charAt(0).toUpperCase() + s.slice(1),
      price: item.pricing[s].toFixed(2),
      priceCurrency: 'USD',
      description: 'Estimated price; varies by stand',
    }));
  }
  const nutrition = nutritionNode(item);
  if (nutrition) node.nutrition = nutrition;
  if (item.flavors && item.flavors.length) node.suitableForDiet = undefined;
  return node;
}

// ---------- FAQ extraction ----------
function extractFaqs(html) {
  const faqs = [];
  const re = /<details class="faq-item">[\s\S]*?<summary class="faq-question">\s*<span>([\s\S]*?)<\/span>[\s\S]*?<div class="faq-answer">([\s\S]*?)<\/div>/g;
  let m;
  while ((m = re.exec(html))) {
    const q = m[1].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    const a = m[2].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    if (q && a) faqs.push([q, a.slice(0, 900)]);
  }
  return faqs;
}

// ---------- write ----------
const START = '<!-- SCHEMA:SITE:START -->', END = '<!-- SCHEMA:SITE:END -->';
let touched = 0;
const report = [];

for (const file of fs.readdirSync(ROOT).filter(f => f.endsWith('.html'))) {
  const full = path.join(ROOT, file);
  const raw = fs.readFileSync(full, 'utf8');
  const crlf = raw.includes('\r\n');
  let html = raw.replace(/\r\n/g, '\n');
  if (html.includes('generated by tools/')) continue;          // generated pages own their graph
  if (!html.includes('</head>')) continue;

  const graph = [ORG, WEBSITE];
  const notes = [];

  const cat = CATEGORY_PAGES[file];
  if (cat) {
    const items = MENU.items.filter(i => cat.cats.includes(i.category));
    if (items.length) {
      graph.push({
        '@type': 'Menu',
        '@id': `${cat.url}#menu`,
        name: cat.name,
        url: cat.url,
        inLanguage: 'en-US',
        hasMenuSection: cat.cats.map(c => {
          const catName = (MENU.categories.find(x => x.id === c) || {}).name || c;
          const list = MENU.items.filter(i => i.category === c);
          return {
            '@type': 'MenuSection',
            name: `7 Brew ${catName}`,
            numberOfItems: list.length,
            hasMenuItem: list.map(i => menuItemNode(i, cat.url)),
          };
        }),
      });
      notes.push(`Menu with ${items.length} items`);
    }
  }

  // Add an FAQPage when the page shows FAQs and has no hand-written FAQ schema.
  // The managed block is excluded from that test: it is about to be replaced, so
  // counting the FAQPage we wrote last run would drop it on every re-run.
  const bStart = html.indexOf(START), bEnd = html.indexOf(END);
  const outsideBlock = bStart >= 0 && bEnd > bStart
    ? html.slice(0, bStart) + html.slice(bEnd + END.length)
    : html;
  if (!/"@type":\s*"FAQPage"/.test(outsideBlock)) {
    const faqs = extractFaqs(html);
    if (faqs.length >= 3) {
      graph.push({
        '@type': 'FAQPage',
        mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
      });
      notes.push(`FAQPage with ${faqs.length} questions`);
    }
  }

  const block = `${START}<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')}</script>${END}`;
  const i = html.indexOf(START), j = html.indexOf(END);
  html = i >= 0 && j > i
    ? html.slice(0, i) + block + html.slice(j + END.length)
    : html.replace('</head>', block + '</head>');

  fs.writeFileSync(full, crlf ? html.replace(/\n/g, '\r\n') : html);
  touched++;
  if (notes.length) report.push(`  ${file}: ${notes.join(', ')}`);
}

console.log(`site entity (Organization + WebSite) written to ${touched} hand-written pages`);
report.forEach(r => console.log(r));
