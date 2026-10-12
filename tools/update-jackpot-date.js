// Jackpot Day is the 7th of every month, so every "the next one is <date>" line goes
// stale monthly. The date was hardcoded in the meta description, the FAQ schema and
// the prose — so a date that had already passed was being served into the search
// snippet for queries like "7 brew jackpot day october 2026".
//
//   node tools/update-jackpot-date.js            # next 7th from today
//   node tools/update-jackpot-date.js 2026-12-07 # pin a date
//
// Only the "next date" claims are touched. jackpot-day.html also carries a SCHEDULE
// TABLE of every upcoming 7th (month / weekday / date); those rows are left alone —
// a bare date regex flattens all of them into one date, which is wrong.
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December'];
const MONTH_RE = MONTHS.join('|');

function nextSeventh(from = new Date()) {
  const y = from.getUTCFullYear(), m = from.getUTCMonth(), d = from.getUTCDate();
  return d <= 7 ? new Date(Date.UTC(y, m, 7)) : new Date(Date.UTC(y, m + 1, 7));
}

const arg = process.argv[2];
const target = arg ? new Date(arg + 'T00:00:00Z') : nextSeventh();
if (isNaN(target)) throw new Error(`bad date: ${arg}`);
if (target.getUTCDate() !== 7) throw new Error('Jackpot Day is always the 7th');

const DATE = `${MONTHS[target.getUTCMonth()]} 7, ${target.getUTCFullYear()}`;
const DAY = target.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });
const D = `(?:${MONTH_RE}) 7, 20\\d\\d`;

// Each pattern anchors on the words around the date, so the schedule table — whose
// cells hold a bare date with no such lead-in — is never matched.
const PATTERNS = [
  [new RegExp(`(Next date: )${D}`, 'g'), `$1${DATE}`],
  [new RegExp(`(The next Jackpot Day is )${D}, a (?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)`, 'g'), `$1${DATE}, a ${DAY}`],
  [new RegExp(`(the next one is )${D}`, 'g'), `$1${DATE}`],
  [new RegExp(`(Next Jackpot Day: )${D}`, 'g'), `$1${DATE}`],
  [new RegExp(`(The next jackpot day date is )${D}`, 'g'), `$1${DATE}`],
  [new RegExp(`(Jackpot Day on the 7th \\(next: )${D}`, 'g'), `$1${DATE}`],
  [new RegExp(`(next on )${D}`, 'g'), `$1${DATE}`],
];

let total = 0;
for (const file of ['jackpot-day.html', 'deals.html']) {
  const p = path.join(ROOT, file);
  const before = fs.readFileSync(p, 'utf8');
  let after = before, n = 0;
  for (const [re, to] of PATTERNS) {
    const hits = (after.match(re) || []).length;
    if (hits) { after = after.replace(re, to); n += hits; }
  }
  if (after === before) { console.log(`  ${file}: already ${DATE}`); continue; }
  fs.writeFileSync(p, after);
  total += n;
  console.log(`  ${file}: ${n} "next date" mention${n === 1 ? '' : 's'} -> ${DATE}`);
}

// Guard 1: no "next date" claim may point at a date that has already passed.
const today = new Date(new Date().toISOString().slice(0, 10) + 'T00:00:00Z');
const parse = s => { const [mon, , yr] = s.replace(',', '').split(' '); return new Date(Date.UTC(+yr, MONTHS.indexOf(mon), 7)); };
const NEXT_CLAIM = new RegExp(`(?:Next date: |next one is |Next Jackpot Day: |next jackpot day date is |\\(next: |next on |The next Jackpot Day is )(${D})`, 'g');
for (const file of ['jackpot-day.html', 'deals.html']) {
  const s = fs.readFileSync(path.join(ROOT, file), 'utf8');
  let m;
  while ((m = NEXT_CLAIM.exec(s))) {
    if (parse(m[1]) < today) throw new Error(`${file} still advertises a past Jackpot Day: ${m[1]}`);
  }
}

// Guard 2: the schedule table must still hold a run of distinct months.
const jp = fs.readFileSync(path.join(ROOT, 'jackpot-day.html'), 'utf8');
const allDates = new Set(jp.match(new RegExp(D, 'g')) || []);
if (allDates.size < 6) {
  throw new Error(`schedule table looks flattened — only ${allDates.size} distinct dates left on the page`);
}

console.log(`next Jackpot Day: ${DATE} (${DAY}) — ${total} replacement(s); schedule table intact with ${allDates.size} distinct dates`);
