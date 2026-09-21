#!/usr/bin/env node
// Builds /7-brew-hours from the stand data, so the numbers stay true after a refresh.
//
//   node tools/build-hours-page.js

'use strict';
const fs = require('fs');
const path = require('path');
const { siteNodes } = require('./site-entity');

const ROOT = path.join(__dirname, '..');
const SITE = 'https://7brewsmenuus.com';
const V = '20260912c';
const DAYS = [['Mo', 'Monday'], ['Tu', 'Tuesday'], ['We', 'Wednesday'], ['Th', 'Thursday'], ['Fr', 'Friday'], ['Sa', 'Saturday'], ['Su', 'Sunday']];

const snapshot = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/locations.json'), 'utf8'));
const stands = snapshot.locations;
const CHECKED = new Date(snapshot.checked + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
const TODAY = new Date().toISOString().slice(0, 10);

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
function fmt(hhmm) {
  let [h, m] = hhmm.split(':').map(Number);
  if (h === 0 && m === 0) return 'midnight';
  if (h === 24) return 'midnight';
  const ap = h >= 12 ? 'PM' : 'AM';
  const hh = h % 12 || 12;
  return m ? `${hh}:${String(m).padStart(2, '0')} ${ap}` : `${hh} ${ap}`;
}

// ---- distributions ----
const schedules = new Map();
const opens = {}, closes = {};
const perDay = {};
for (const l of stands) {
  const key = (l.hours || []).join(' | ');
  schedules.set(key, (schedules.get(key) || 0) + 1);
  for (const h of l.hours || []) {
    const m = h.match(/^([A-Za-z,]+) (\d{2}:\d{2})-(\d{2}:\d{2})$/);
    if (!m) continue;
    opens[m[2]] = (opens[m[2]] || 0) + 1;
    closes[m[3]] = (closes[m[3]] || 0) + 1;
    for (const d of m[1].split(',')) {
      perDay[d] = perDay[d] || {};
      const k = `${m[2]}-${m[3]}`;
      perDay[d][k] = (perDay[d][k] || 0) + 1;
    }
  }
}
const ranked = [...schedules.entries()].sort((a, b) => b[1] - a[1]);
const [topKey, topCount] = ranked[0];
const topPct = Math.round((topCount / stands.length) * 100);
const earliestOpen = Object.keys(opens).sort()[0];
const earliestCount = opens[earliestOpen];
// treat post-midnight closes as latest
const closeVal = t => { const [h, m] = t.split(':').map(Number); return (h < 5 ? h + 24 : h) * 60 + m; };
const latestClose = Object.keys(closes).sort((a, b) => closeVal(b) - closeVal(a))[0];
const latestCount = closes[latestClose];

// typical hours per weekday, for the table and the live widget
const typical = {};
for (const [code, label] of DAYS) {
  const best = Object.entries(perDay[code] || {}).sort((a, b) => b[1] - a[1])[0];
  const [o, c] = best[0].split('-');
  typical[code] = { label, opens: o, closes: c, count: best[1] };
}
const weekdayRows = DAYS.map(([code]) => {
  const t = typical[code];
  return `<tr><th scope="row" style="font-weight:600;">${t.label}</th><td>${fmt(t.opens)}</td><td>${fmt(t.closes)}</td><td>${t.count} of ${stands.length} stands</td></tr>`;
}).join('\n');

const variantRows = ranked.slice(0, 8).map(([key, n]) => {
  const parts = key.split(' | ').map(p => {
    const m = p.match(/^([A-Za-z,]+) (\d{2}:\d{2})-(\d{2}:\d{2})$/);
    if (!m) return esc(p);
    const days = m[1].split(',').map(d => (DAYS.find(x => x[0] === d) || ['', d])[1].slice(0, 3)).join(', ');
    return `${days}: ${fmt(m[2])}–${fmt(m[3])}`;
  }).join('<br/>');
  return `<tr><th scope="row" style="font-weight:600;">${n} stand${n === 1 ? '' : 's'}</th><td>${parts}</td></tr>`;
}).join('\n');

const faqs = [
  ['What time does 7 Brew open?',
    `Almost every 7 Brew opens at ${fmt(typical.Mo.opens)}. ${typical.Mo.count} of the ${stands.length} stands in the official locator open then on a Monday; the earliest anywhere opens at ${fmt(earliestOpen)}.`],
  ['What time does 7 Brew close?',
    `Most stands close at ${fmt(typical.Mo.closes)} Sunday through Thursday and ${fmt(typical.Fr.closes)} on Friday and Saturday. A handful stay open later — the latest listed closing time is ${fmt(latestClose)}.`],
  ['Is 7 Brew open on Sundays?',
    `Yes. ${typical.Su.count} of ${stands.length} stands keep the same Sunday hours as the rest of the week, opening at ${fmt(typical.Su.opens)} and closing at ${fmt(typical.Su.closes)}.`],
  ['Is 7 Brew open 24 hours?',
    'No. No stand in the official locator runs 24 hours. The longest days end after midnight at a small number of locations.'],
  ['Are 7 Brew hours the same at every location?',
    `Nearly. ${topPct}% of stands share one schedule, and there are only ${ranked.length} distinct schedules across all ${stands.length} stands. Every 7 Brew is independently owned, so check your stand before an early or late run.`],
  ['Is 7 Brew open on holidays?',
    'Hours on major holidays such as Thanksgiving and Christmas are set stand by stand and are not published in the official locator, so confirm with your local stand rather than assuming the usual schedule.'],
];

const faqHtml = faqs.map(([q, a]) =>
  `<details style="background:var(--card-bg, #f8f5f0); border:1px solid var(--border, #e0dcd5); border-radius:10px; padding:14px 18px; margin-bottom:10px;"><summary style="cursor:pointer; font-weight:600;">${esc(q)}</summary><p style="margin-top:8px;">${esc(a)}</p></details>`).join('\n');

const url = `${SITE}/7-brew-hours`;
const title = '7 Brew Hours: Opening &amp; Closing Times (2026)';
const description = `Most 7 Brew stands open at ${fmt(typical.Mo.opens)} and close at ${fmt(typical.Mo.closes)}, or ${fmt(typical.Fr.closes)} Friday and Saturday — ${topPct}% of all ${stands.length} stands share the same schedule. Live open/closed check inside.`;

const graph = [
    ...siteNodes(),
  { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: '7 Brew Hours: Opening & Closing Times (2026)', description, dateModified: TODAY, isPartOf: { '@id': `${SITE}/#website` } },
  { '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Menu', item: `${SITE}/` },
    { '@type': 'ListItem', position: 2, name: 'Locations', item: `${SITE}/locations` },
    { '@type': 'ListItem', position: 3, name: 'Hours', item: url }] },
  { '@type': 'FAQPage', mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
];

// live status uses the typical schedule in the visitor's own clock
const statusScript = `<script>(function(){
var typ=${JSON.stringify(DAYS.map(([c]) => ({ o: typical[c].opens, c: typical[c].closes })))};
var now=new Date(),js=now.getDay(),i=(js+6)%7,t=typ[i];
function mins(s){var p=s.split(':');return (+p[0])*60+(+p[1]);}
var cur=now.getHours()*60+now.getMinutes(),open=mins(t.o),close=mins(t.c);
if(close<open)close+=1440;
var isOpen=cur>=open&&cur<close;
var el=document.getElementById('hoursStatus');
if(!el)return;
function fmt(m){m=m%1440;var h=Math.floor(m/60),mm=m%60,ap=h>=12?'PM':'AM';h=h%12||12;return h+(mm?(':'+(mm<10?'0':'')+mm):'')+' '+ap;}
el.innerHTML=isOpen
 ?'<strong style="color:#166534;">Open right now</strong> at a typical stand — closing at '+fmt(close)+' your time.'
 :'<strong style="color:#991B1B;">Closed right now</strong> at a typical stand — opening at '+fmt(open)+(cur>=close?' tomorrow':'')+' your time.';
})();</script>`;

const src = fs.readFileSync(path.join(ROOT, 'locations.html'), 'utf8').replace(/\r\n/g, '\n');
const HEADER = src.slice(src.indexOf('<body>') + 6, src.indexOf('<main'));
const FOOTER = src.slice(src.indexOf('</main>') + 7, src.indexOf('</body>'));
if (!HEADER.includes('site-header') || !FOOTER.includes('site-footer')) throw new Error('chrome extraction failed');

const html = `<!DOCTYPE html>
<!-- generated by tools/build-hours-page.js -->

<html lang="en"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1" name="viewport"/><title>${title}</title><meta content="${esc(description)}" name="description"/><link href="${url}" rel="canonical"/><meta content="${title}" property="og:title"/><meta content="${esc(description)}" property="og:description"/><meta content="${url}" property="og:url"/><meta content="article" property="og:type"/><meta content="summary_large_image" name="twitter:card"/><meta content="${title}" name="twitter:title"/><meta content="${esc(description)}" name="twitter:description"/><meta content="${SITE}/assets/products/category-classics.webp" property="og:image"/><meta content="7 Brew drive-thru" property="og:image:alt"/><meta content="640" property="og:image:width"/><meta content="640" property="og:image:height"/><link href="css/styles.css?v=${V}" rel="stylesheet"/><link href="css/modern.css?v=${V}" rel="stylesheet"/><link href="assets/favicon.svg" rel="icon" type="image/svg+xml"/><link href="favicon.ico" rel="alternate icon" type="image/x-icon"/><link href="assets/apple-touch-icon.png" rel="apple-touch-icon"/><script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')}</script></head><body>${HEADER}<main class="research-guide container"><nav aria-label="Breadcrumb"><a href="/">Menu</a> / <a href="locations">Locations</a> / Hours</nav><article>
<p class="guide-eyebrow">Official directory snapshot · Checked ${CHECKED}</p>
<h1>7 Brew Hours: When Does 7 Brew Open and Close?</h1>
<p class="guide-lead">Most 7 Brew stands open at <strong>${fmt(typical.Mo.opens)}</strong> and close at <strong>${fmt(typical.Mo.closes)}</strong>, staying open until <strong>${fmt(typical.Fr.closes)}</strong> on Friday and Saturday. That single schedule covers <strong>${topCount} of the ${stands.length} stands</strong> (${topPct}%) in the official locator.</p>

<div id="hoursStatus" style="background:#F8FAFC; border:2px solid #E2E8F0; border-radius:12px; padding:16px 20px; margin:18px 0; font-size:1.05rem;">Checking against typical hours…</div>

<section><h2>7 Brew hours by day</h2>
<div class="guide-table"><table><thead><tr><th scope="col">Day</th><th scope="col">Opens</th><th scope="col">Closes</th><th scope="col">Stands on this schedule</th></tr></thead><tbody>
${weekdayRows}
</tbody></table></div>
<p>Hours are local to each stand. Every 7 Brew is drive-thru only, so "open" means the lane is running — there is no lobby to sit in.</p></section>

<section><h2>How much do hours actually vary?</h2>
<p>Less than you would expect for a ${stands.length}-stand chain. There are only <strong>${ranked.length} distinct schedules</strong> in the entire official locator:</p>
<div class="guide-table"><table><thead><tr><th scope="col">How many</th><th scope="col">Schedule</th></tr></thead><tbody>
${variantRows}
</tbody></table></div>
<p>The outliers matter if you are making a special trip: ${earliestCount} stand${earliestCount === 1 ? '' : 's'} open as early as <strong>${fmt(earliestOpen)}</strong>, and the latest any stand runs is <strong>${fmt(latestClose)}</strong>.</p></section>

<section><h2>Check your own stand</h2>
<p>These are chain-wide patterns. For the exact hours of one drive-thru, open its page — every stand we list shows its own published weekly schedule:</p>
<ul class="guide-link-grid">
<li><a href="locations">Search all ${stands.length} stands</a></li>
<li><a href="locations/tx">Texas hours</a></li>
<li><a href="locations/fl">Florida hours</a></li>
<li><a href="locations/oh">Ohio hours</a></li>
<li><a href="locations/mo">Missouri hours</a></li>
<li><a href="locations#browse-by-state">Every state</a></li>
</ul></section>

<section><h2>Holiday hours</h2>
<p>7 Brew does not publish holiday hours in its locator, and each stand is independently owned, so Thanksgiving, Christmas and New Year schedules are set locally. Treat any holiday hours you see quoted online — including "closed Christmas Day" — as unconfirmed, and call the stand or check its official page before driving over.</p>
<p>The one date that is reliable is the monthly promotion: <a href="jackpot-day">Jackpot Day runs the 7th of every month, 7 a.m. to 7 p.m.</a></p></section>

<section><h2>7 Brew hours FAQ</h2>
${faqHtml}
</section>

<div class="guide-note">This independent guide is not operated or endorsed by 7 Brew. Hours come from the official 7 Brew locator, checked ${CHECKED}, and can change without notice. <a href="about#sources">Sources</a>.</div>
</article></main>${FOOTER}${statusScript}</body></html>
`;

fs.writeFileSync(path.join(ROOT, '7-brew-hours.html'), html.replace(/\n/g, '\r\n'));

// sitemap
const SITEMAP = path.join(ROOT, 'sitemap.xml');
let sm = fs.readFileSync(SITEMAP, 'utf8');
const crlf = sm.includes('\r\n');
sm = sm.replace(/\r\n/g, '\n');
if (!sm.includes(`${SITE}/7-brew-hours<`)) {
  sm = sm.replace('</urlset>', `  <url>\n    <loc>${SITE}/7-brew-hours</loc>\n    <lastmod>${TODAY}</lastmod>\n    <priority>0.8</priority>\n    <changefreq>monthly</changefreq>\n  </url>\n</urlset>`);
}
fs.writeFileSync(SITEMAP, crlf ? sm.replace(/\n/g, '\r\n') : sm);

console.log(`built /7-brew-hours — ${topPct}% on one schedule, ${ranked.length} schedules, earliest ${fmt(earliestOpen)}, latest ${fmt(latestClose)}`);
