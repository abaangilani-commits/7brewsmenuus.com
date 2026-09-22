// Works the Ahrefs intent groups into the pages that should already own them:
// adds the question-shaped FAQs people actually search, keeps each page's
// FAQPage schema in sync with what is visible, and links the new guides in.
//
//   node tools/embed-keywords.js
//
// Idempotent — re-running makes no further changes.
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const esc = s => String(s).replace(/&(?!(amp|lt|gt|quot|#\d+);)/g, '&amp;');

const changes = [];
function write(file, before, after, note) {
  // `before` is on disk (CRLF); `after` has been normalised to LF. Compare content,
  // not line endings, so a no-op run reports no changes and rewrites nothing.
  if (before.replace(/\r\n/g, '\n') === after.replace(/\r\n/g, '\n')) return false;
  const crlf = before.includes('\r\n');
  fs.writeFileSync(path.join(ROOT, file), crlf ? after.replace(/\n/g, '\r\n').replace(/\r\r\n/g, '\r\n') : after);
  changes.push(`${file}: ${note}`);
  return true;
}

// ---------------------------------------------------------------- FAQ content
// [question, answer html] — answers must stay true to what the page already says.
const FAQS = {
  'app-rewards.html': [
    ['Does 7 Brew have an app?',
     'Yes. The 7 Brew app is free on iPhone and Android, and it is where the rewards programme lives — points, your balance, redeeming a free drink and mobile ordering at participating stands.'],
    ['How do I log in to 7 Brew Rewards?',
     'Rewards are part of the 7 Brew app rather than a separate website, so there is no browser login. Open the app, sign in with the phone number or email you registered, and your points are on the Rewards tab.'],
    ['Do you get a free drink on your birthday at 7 Brew?',
     'Add your birthdate to your app profile and check the Rewards tab during your birthday month. Birthday perks are not listed on the official Rewards page, so treat availability and terms as varying by stand and by year.'],
    ['Do 7 Brew Energy cans earn rewards points?',
     'No. Since August 12, 2026, canned 7 Brew Energy and kids-size drinks no longer earn points. Small, medium and large drinks still earn 100 points each.'],
  ],
  'what-is-7-brew.html': [
    ['Where did 7 Brew start?',
     '7 Brew started in Rogers, Arkansas, in 2017, when founders Ron and Jori Crume opened a single drive-thru stand in Northwest Arkansas.'],
    ['When was 7 Brew founded?',
     '2017. The first stand opened that year in Rogers, Arkansas, and the chain stayed Arkansas-only until expanding in 2019.'],
    ['Why is it called 7 Brew?',
     'The name comes from the seven signature drinks the brand launched with. Those 7 Originals — Blondie, Sweet &amp; Salty, Cinnamon Roll, Brunette, Banana Bread, Smooth 7 and Cookie Butter — are still their own section on the menu board today.'],
    ['Where is 7 Brew&rsquo;s headquarters?',
     '7 Brew is headquartered in Rogers, Arkansas, the same Northwest Arkansas town where the first stand opened.'],
    ['Who owns 7 Brew?',
     '7 Brew is led by founders Ron and Jori Crume and has taken a growth investment from Blackstone to fund its expansion. It remains privately held.'],
    ['Is 7 Brew publicly traded?',
     'No. There is no 7 Brew stock to buy — the company is private, despite steady search interest in a possible 7 Brew IPO.'],
  ],
  'energy-drinks.html': [
    ['What 7 Energy flavors are there?',
     'The menu board lists seven: Brewberry, Pixie Stick, Nightshade, Ocean Breeze, Tropic Thunder, Sunrise and Heatwave. Each is a flavour combination over the same energy base, and all can be ordered sugar-free.'],
    ['Where can I buy 7 Brew energy cans?',
     'Canned 7 Brew energy and coffee are sold in grocery, not at the stands themselves — see our <a href="canned-drinks-walmart">guide to the canned range at Walmart</a>. Note that cans do not earn rewards points.'],
    ['Which 7 Brew energy drink is best?',
     'Brewberry and Ocean Breeze are the two most ordered, and both have published sugar-free versions. If you want the least sweet, Heatwave is the citrus one; if you want the most, Pixie Stick is built to taste like the candy.'],
    ['Is there a 7 Energy secret menu?',
     'Not an official one. What people call the energy secret menu is custom flavour combinations over the standard 7 Energy base — our <a href="secret-menu">secret menu guide</a> lists the combinations worth asking for and how to order them.'],
  ],
  'secret-menu.html': [
    ['Is there a 7 Brew energy secret menu?',
     'Yes, in the sense that most custom builds are energy drinks. The 7 Energy base takes any syrup combination, so the energy side of the secret menu is the largest — see the energy builds above, or the full <a href="energy-drinks">7 Energy flavour list</a>.'],
    ['Is there a 7 Fizz secret menu?',
     'Same idea with a soda-water base instead of the energy base. Any syrup combination that works in a 7 Energy works in a 7 Fizz; the <a href="fizz-drinks">7 Fizz menu</a> has the four standard flavours to build from.'],
    ['Is there a 7 Brew secret menu PDF?',
     'Not an official one — 7 Brew publishes no secret menu, so any PDF claiming to be one is unofficial. You can download our printable <a href="menu-pdf">7 Brew menu PDF</a> of the standard menu with prices instead.'],
  ],
  'allergen-dietary-guide.html': [
    ['What sugar-free flavors does 7 Brew have?',
     '7 Brew publishes nutrition for 43 sugar-free drinks, including three sugar-free 7 Energy flavours and two sugar-free 7 Fizz sodas. Our <a href="sugar-free">sugar-free menu guide</a> lists all of them with calories, sugar and caffeine.'],
    ['Does 7 Brew have decaf?',
     'Yes. Decaf espresso is available in place of regular in any espresso drink, and the tea menu includes a decaf tea. The naturally caffeine-free options — lemonades and 7 Fizz sodas — are on our <a href="kids-menu">caffeine-free menu</a>.'],
    ['Does 7 Brew have food?',
     'No. Every category on the menu board is a drink, so there is nothing to check for food allergens. Our <a href="food-menu">7 Brew food page</a> explains why the menu lists names like Cinnamon Roll and Banana Bread.'],
  ],
  'sizes-caffeine.html': [
    ['What sizes does 7 Brew have?',
     'Three: small, medium and large. Iced drinks are 16, 24 and 32 oz; hot drinks are 12, 16 and 20 oz. Kids sizes are also available on some drinks.'],
    ['What is the largest size at 7 Brew?',
     'A large — 32 oz iced or 20 oz hot. A large espresso drink is pulled with four shots rather than the two in a small or medium.'],
  ],
};

// ------------------------------------------------- insert the visible accordions
// Three FAQ markup styles exist on the site; match whichever the page uses.
const STYLE_A_ITEM = (q, a) =>
  `<details class="faq-item"><summary class="faq-question"><span>${esc(q)}</span><span class="faq-toggle">+</span></summary><div class="faq-answer"><p>${a}</p></div></details>`;
const STYLE_B_ITEM = (q, a) =>
  `<details style="border:1px solid #E8E0D8; border-radius:8px; padding:14px 18px; margin-bottom:10px;"><summary style="font-weight:700; cursor:pointer; color:#233c36;">${esc(q)}</summary><p style="margin-top:10px;">${a}</p></details>`;

for (const [file, faqs] of Object.entries(FAQS)) {
  const before = read(file);
  let html = before.replace(/\r\n/g, '\n');

  // skip questions already on the page
  const pending = faqs.filter(([q]) => !html.includes(esc(q)) && !html.includes(q));
  if (!pending.length) continue;

  // Append after the last </details> inside whichever FAQ container the page uses.
  const appendAfterLastDetails = (startMarker, item) => {
    const start = html.indexOf(startMarker);
    if (start < 0) throw new Error(`${file}: ${startMarker} not found`);
    let end = html.indexOf('</section>', start);
    if (end < 0) end = html.indexOf('<div class="guide-note"', start);
    if (end < 0) end = html.length;
    const last = html.lastIndexOf('</details>', end);
    if (last < start) throw new Error(`${file}: no </details> inside the FAQ container`);
    const at = last + '</details>'.length;
    html = html.slice(0, at) + pending.map(([q, a]) => item(q, a)).join('') + html.slice(at);
  };

  if (html.includes('class="faq-accordion"')) {
    appendAfterLastDetails('class="faq-accordion"', STYLE_A_ITEM);
  } else if (/<section id="faq"/.test(html)) {
    appendAfterLastDetails('<section id="faq"', STYLE_B_ITEM);
  } else {
    // style C — no visible FAQ at all, though the page carries FAQPage schema.
    // Build the section from the schema's questions plus the new ones.
    const m = html.match(/<script type="application\/ld\+json">(\{[^<]*"@type":\s*"FAQPage"[\s\S]*?)<\/script>/);
    const existing = [];
    if (m) {
      try {
        const j = JSON.parse(m[1]);
        for (const q of j.mainEntity || []) existing.push([q.name, q.acceptedAnswer.text]);
      } catch (e) { throw new Error(`${file}: could not parse existing FAQPage — ${e.message}`); }
    }
    const merged = [...existing];
    for (const [q, a] of pending) {
      const i = merged.findIndex(([eq]) => eq.replace(/&rsquo;/g, "'") === q.replace(/&rsquo;/g, "'"));
      if (i >= 0) merged[i] = [q, a]; else merged.push([q, a]);
    }
    const section = `<section id="faq"><h2>Frequently asked questions</h2><div class="faq-accordion" style="margin-bottom:34px;">` +
      merged.map(([q, a]) => STYLE_A_ITEM(q, a)).join('') + `</div></section>`;
    const anchor = '<div class="guide-note">';
    const at = html.lastIndexOf(anchor);
    if (at < 0) throw new Error(`${file}: no guide-note to anchor the FAQ section to`);
    html = html.slice(0, at) + section + html.slice(at);
  }

  write(file, before, html, `+${pending.length} FAQ${pending.length === 1 ? '' : 's'}`);
}

// ------------------------------------- sync each page's FAQPage to what is visible
function visibleFaqs(html) {
  const out = [];
  const reA = /<details class="faq-item">\s*<summary class="faq-question">\s*<span>([\s\S]*?)<\/span>[\s\S]*?<div class="faq-answer">\s*<p>([\s\S]*?)<\/p>/g;
  const reB = /<details style="border:1px solid #E8E0D8[^"]*">\s*<summary[^>]*>([\s\S]*?)<\/summary>\s*<p[^>]*>([\s\S]*?)<\/p>/g;
  for (const re of [reA, reB]) {
    let m;
    while ((m = re.exec(html))) out.push([m[1], m[2]]);
  }
  return out;
}
const textOf = h => h.replace(/<[^>]+>/g, '')
  .replace(/&amp;/g, '&').replace(/&rsquo;/g, '’').replace(/&nbsp;/g, ' ')
  .replace(/\s+/g, ' ').trim();

// The block between the SCHEMA:SITE markers belongs to tools/build-schema.js — it
// rebuilds the site entity, the Menu graphs and (where the page has no other FAQ
// schema) the FAQPage from the visible accordions. Touching it here destroyed the
// Organization/WebSite nodes and the Menu graphs, so this step now edits only a
// hand-written FAQPage script that sits OUTSIDE those markers, and leaves the rest
// for build-schema.js to regenerate.
const SITE_START = '<!-- SCHEMA:SITE:START -->', SITE_END = '<!-- SCHEMA:SITE:END -->';

for (const file of Object.keys(FAQS)) {
  const before = read(file);
  let html = before.replace(/\r\n/g, '\n');
  const faqs = visibleFaqs(html);
  if (!faqs.length) { console.log(`  ! ${file}: no visible FAQs found to sync`); continue; }

  const s = html.indexOf(SITE_START), e = html.indexOf(SITE_END);
  const inManagedBlock = i => s >= 0 && e > s && i > s && i < e;

  // find a standalone FAQPage script outside the managed block
  const re = /<script type="application\/ld\+json">[\s\S]*?<\/script>/g;
  let target = null, m;
  while ((m = re.exec(html))) {
    if (!/"@type":\s*"FAQPage"/.test(m[0]) || inManagedBlock(m.index)) continue;
    target = m; break;
  }
  if (!target) continue;   // FAQ schema lives in the managed block; build-schema.js handles it

  const block = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(([q, a]) => ({
      '@type': 'Question',
      name: textOf(q),
      acceptedAnswer: { '@type': 'Answer', text: textOf(a) },
    })),
  }).replace(/</g, '\\u003c');

  html = html.slice(0, target.index) +
    `<script type="application/ld+json">${block}</script>` +
    html.slice(target.index + target[0].length);
  write(file, before, html, `FAQPage synced to ${faqs.length} visible questions`);
}

// ------------------------------------------------------------- factual fixes
{
  // The allergen guide's stat tile said 4 sugar-free energy flavours; the official
  // nutrition guide publishes 3 (Brewberry, Ocean Breeze, Sunrise).
  const file = 'allergen-dietary-guide.html';
  const before = read(file);
  const after = before.replace(
    /(<div style="font-size:1\.6rem; font-weight:800; color:#EA0029;">)4(<\/div>\s*<div style="font-size:0\.85rem; color:#5C4F4A;">Sugar-Free Energy Flavors<\/div>)/,
    '$13$2');
  write(file, before, after, 'sugar-free energy flavour count 4 → 3 (matches published nutrition)');
}

// ---------------------------------------------------------- link the new guides
{
  const file = 'guides.html';
  const before = read(file);
  let html = before.replace(/\r\n/g, '\n');
  const additions = [
    ['sugar-free', '7 Brew Sugar-Free Menu: 43 Drinks with Calories &amp; Sugar'],
    ['food-menu', 'Does 7 Brew Have Food? The Drinks That Sound Like Dessert'],
    ['brewista-test', '7 Brew Brewista &amp; Scoops Test: What It Covers'],
  ];
  const pending = additions.filter(([slug]) => !html.includes(`href="${slug}"`));
  if (pending.length) {
    const anchor = '<h2>Ordering &amp; Tips</h2>\n<ul class="guide-link-grid">';
    const flat = html.includes(anchor) ? anchor : '<h2>Ordering &amp; Tips</h2><ul class="guide-link-grid">';
    if (!html.includes(flat)) throw new Error('guides.html: ordering section not found');
    html = html.replace(flat, flat + pending.map(([s, t]) => `<li><a href="${s}">${t}</a></li>`).join(''));
    write(file, before, html, `+${pending.length} guide links`);
  }
}
{
  const file = 'locations.html';
  const before = read(file);
  let html = before.replace(/\r\n/g, '\n');
  if (!html.includes('href="new-locations"')) {
    // put it next to the existing hours link if there is one, else before the note
    const anchor = html.includes('href="7-brew-hours"')
      ? html.slice(html.indexOf('href="7-brew-hours"'))
      : null;
    if (anchor) {
      const liStart = html.lastIndexOf('<li>', html.indexOf('href="7-brew-hours"'));
      const liEnd = html.indexOf('</li>', liStart) + 5;
      html = html.slice(0, liEnd) + '<li><a href="new-locations">New 7 Brew locations and where it is expanding</a></li>' + html.slice(liEnd);
      write(file, before, html, '+1 link to /new-locations');
    } else {
      console.log('  ! locations.html: no 7-brew-hours link to anchor to, skipped');
    }
  }
}

// ------------------------------------------------ sitewide nav: the More menu
{
  const NAV_ADDS = [
    { after: '<a href="energy-drinks" title="7 Energy drink flavors and caffeine content">7 Energy Drinks</a>',
      link: '<a href="sugar-free" title="Every sugar-free 7 Brew drink with calories">Sugar-Free Menu</a>' },
    { after: '<a href="kids-menu" title="Caffeine-free and kid-friendly menu picks">Kids &amp; Caffeine-Free Menu</a>',
      link: '<a href="food-menu" title="Does 7 Brew sell food? What the menu really has">Does 7 Brew Have Food?</a>' },
  ];
  function walk(d, out = []) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      if (e.name === 'node_modules' || e.name === '.git' || e.name === 'tools') continue;
      const p = path.join(d, e.name);
      e.isDirectory() ? walk(p, out) : e.name.endsWith('.html') && out.push(p);
    }
    return out;
  }
  let touched = 0;
  for (const abs of walk(ROOT)) {
    const rel = path.relative(ROOT, abs);
    const before = fs.readFileSync(abs, 'utf8');
    let html = before.replace(/\r\n/g, '\n');
    let changed = false;
    for (const { after, link } of NAV_ADDS) {
      const href = link.match(/href="([^"]+)"/)[1];
      if (html.includes(`href="${href}"`) || !html.includes(after)) continue;
      html = html.replace(after, after + link);
      changed = true;
    }
    if (!changed) continue;
    const crlf = before.includes('\r\n');
    fs.writeFileSync(abs, crlf ? html.replace(/\n/g, '\r\n').replace(/\r\r\n/g, '\r\n') : html);
    touched++;
  }
  if (touched) changes.push(`nav: 2 links added to the More menu across ${touched} pages`);
}

console.log(changes.length ? changes.map(c => '  ' + c).join('\n') : '  no changes (already applied)');
