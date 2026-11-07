#!/usr/bin/env python3
"""Build /blog/veterans-day from the december-drinks shell + hub/november/deals/sitemap updates.
Facts (official 7brew.com/whats-new, checked 2026-11-02): Tue Nov 11 2026, veterans 50% off
their drink ORDER at participating stands, NO ID/proof required, tell your brewista."""
import json, re

TITLE = "7 Brew Veterans Day 2026: 50% Off Your Drink Order, No ID Needed"
DESC = "7 Brew Veterans Day 2026: veterans get 50% off their whole drink order on Wednesday, November 11, at participating stands. No ID needed, just tell your brewista."
URL = "https://7brewsmenuus.com/blog/veterans-day"
IMG = "https://7brewsmenuus.com/assets/products/category-classics.webp"
IMG_ALT = "7 Brew classic coffee drinks, half price for veterans on Veterans Day, November 11, 2026"
DATE = "2026-11-02T11:30:00+05:00"

FAQS = [
    ("Does 7 Brew have a Veterans Day deal in 2026?",
     "Yes. On Wednesday, November 11, 2026, veterans get 50% off their drink order at participating 7 Brew stands. It runs all day, during the stand's normal hours."),
    ("Do I need to show a military ID at 7 Brew on Veterans Day?",
     "No. 7 Brew's official Veterans Day FAQ says there is no ID required and no proof of service to show. You simply let your brewista know you are a veteran when you order."),
    ("Is the 7 Brew Veterans Day deal 50% off one drink or the whole order?",
     "The whole drink order. Early coverage of the announcement said 50% off any drink, but 7 Brew's own page words it as 50% off their drink order, and that is the version that counts. The $3 bakery treats are food, not drinks, so do not count on them being halved."),
    ("Does every 7 Brew stand take part in the Veterans Day deal?",
     "No, it is participating stands only, like most 7 Brew promotions. Most stands take part, but check your stand's social page or ask at the window before you make a special trip."),
    ("I am active duty, not a veteran. Do I get the 7 Brew Veterans Day deal?",
     "7 Brew's official wording says veterans, and it does not mention active-duty service members, spouses or family. That does not mean your stand will say no. It means the chain has not promised it. Ask at the window, and if they honor it, that is the stand being generous, not a chain rule."),
]

shell = open('blog/december-drinks.html', encoding='utf-8').read()
head, rest = shell.split('</head>', 1)
body_after_head = rest  # starts with <body>... keep header+footer from here later

# ---------- rebuild head from december head ----------
h = head
h = h.replace("7 Brew December Drinks 2026: Expected Lineup, Dates and Last Year's Favorites", TITLE)
h = h.replace("7 Brew's December 2026 drinks are not announced yet. Here is when to expect them, the holiday regulars from the last two winters with their builds, and the December dates that matter, including Jackpot Day on Dec 7.", DESC)
h = h.replace("7 Brew November 2026: five new bakery treats at $3 each, six dessert drinks, double points Nov 7 and 50% off for veterans Nov 11. See the full lineup.", DESC)
h = h.replace("https://7brewsmenuus.com/blog/december-drinks", URL)
h = h.replace("December Drinks 2026", "Veterans Day 2026")
h = h.replace("https://7brewsmenuus.com/assets/products/product-cinnamonroll.webp", IMG)
h = h.replace("7 Brew Cinnamon Roll coffee, a winter staple while the December 2026 drinks are still unannounced", IMG_ALT)
h = h.replace("2026-10-29T20:45:00+05:00", DATE)
# FAQPage script: replace mainEntity wholesale
faq_json = {"@context": "https://schema.org", "@type": "FAQPage",
            "mainEntity": [{"@type": "Question", "name": q,
                            "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in FAQS]}
h = re.sub(r'\{"@context": "https://schema\.org", "@type": "FAQPage", "mainEntity": \[.*?\]\}',
           json.dumps(faq_json, ensure_ascii=False), h, count=1, flags=re.S)
assert 'FAQPage' in h and FAQS[1][0] in h, "FAQ schema swap failed"
assert 'december' not in h.lower().replace('december 7 is jackpot day', ''), "december leftover in head"
open('/tmp/vet-head.txt', 'w').write(h)

# ---------- new main ----------
faq_html = "\n".join(
    f'<div class="faq-item">\n<h3>{q}</h3>\n<p>{a}</p>\n</div>' for q, a in FAQS)

main = f'''<main class="container" id="main-content">
<nav aria-label="Breadcrumb" class="breadcrumb">
<a href="/">Home</a> <span aria-hidden="true">›</span> <a href="/blog/">Blog</a> <span aria-hidden="true">›</span> <span aria-current="page">Veterans Day 2026</span>
</nav>
<h1>7 Brew Veterans Day 2026: 50% Off Your Whole Drink Order</h1>
<p class="updated-line">Published November 2, 2026 · Terms checked against 7 Brew's official site today</p>
<p class="lead">Yes, 7 Brew has a Veterans Day deal, and it is a good one. On Wednesday, November 11, 2026, veterans get 50% off their drink order at participating stands. The detail most coverage missed: you do not need to show a military ID or any proof of service. You just tell your brewista.</p>
<div class="note editorial-note"><strong>Why this page exists:</strong> early stories about this deal said "50% off any drink" and left the ID question open. 7 Brew's own page says drink order, and its FAQ answers the ID question outright. We are publishing the official version, with the source named, so you can plan the trip on facts.</div>
<div class="table-responsive">
<table>
<thead><tr><th>Veterans Day at a glance</th><th>The short version</th></tr></thead>
<tbody>
<tr><td>When</td><td>Wednesday, November 11, 2026, all day during normal stand hours</td></tr>
<tr><td>The deal</td><td>50% off a veteran's drink order</td></tr>
<tr><td>Who gets it</td><td>Veterans</td></tr>
<tr><td>ID or proof needed</td><td>None. No ID required, just tell your brewista you are a veteran</td></tr>
<tr><td>Where</td><td>Participating stands. Most take part, not all</td></tr>
<tr><td>Source</td><td>7 Brew's official whats-new page, checked November 2, 2026</td></tr>
</tbody>
</table>
</div>
<div class="section-header">
<h2 class="section-title">How to get the 50% off</h2>
</div>
<p>It is a three-step deal, and step two is the whole verification process.</p>
<p><strong>1. Pick a participating stand.</strong> Most 7 Brew stands run national promotions, but participation is the stand's call. If the trip matters, check your stand's social page first or ask when you pull in.</p>
<p><strong>2. Tell your brewista you are a veteran.</strong> That is it. No ID card, no DD214, no app screen to show. 7 Brew's official FAQ puts it in one line: there is no ID required, simply let your brewista know.</p>
<p><strong>3. Order like normal.</strong> The half price comes off your drink order at the window. A medium Original runs $5.25 on the standard board, so a veteran pays about $2.63 for it on the 11th. Order the large. It is the one day the upgrade costs about a dollar.</p>
<div class="section-header">
<h2 class="section-title">The two details most coverage got wrong</h2>
</div>
<p><strong>It is the order, not one drink.</strong> The announcement coverage, working from the press release, mostly printed "50% off any drink." 7 Brew's own page says "50% off their drink order." Those are very different deals when you are buying for the car. We go with the official wording.</p>
<p><strong>No ID means no ID.</strong> Most chains with a Veterans Day offer ask for a military ID at the register. 7 Brew put the opposite in writing. If a stand asks anyway, that is the stand adding a step the chain did not, and it is worth knowing before you drive over.</p>
<p>One honest limit: the deal is worded for drinks. The new $3 bakery treats are food, so do not count on them being halved. Points still work the usual way on what you pay, and the deal sits alongside the month's other offers rather than replacing them.</p>
<div class="section-header">
<h2 class="section-title">What to order with it</h2>
</div>
<p>Half price is the day to try the drink you keep skipping. The November lineup is on the board: the Pecan Pie Breve, the French Silk Mocha, and the Tiramisu Cold Brew are the three getting the attention, and the last two are permanent now, so they stay after November ends. The full set, with builds and prices, is in our <a href="/november-drinks">November drinks guide</a>. If you are ordering for a group, the order-wide discount makes Veterans Day the cheapest day of the month to do it.</p>
<div class="section-header">
<h2 class="section-title">Cannot make it on the 11th?</h2>
</div>
<p>Two other November dates are worth a veteran's calendar. <a href="/jackpot-day">Jackpot Day</a> lands Saturday, November 7, with double points and a 100,000-point sweepstakes entry for rewards members. And the full list of what is real right now, from birthday drinks to points math, lives on our <a href="/deals">7 Brew deals page</a>.</p>
<div class="section-header">
<h2 class="section-title">Veterans Day FAQ</h2>
</div>
{faq_html}
<div class="section-header">
<h2 class="section-title">More from the blog</h2>
</div>
<p>See <a href="/november-drinks">the November drinks and bakery lineup</a>, read the <a href="/blog/cookie-butter-recipe">Cookie Butter copycat recipe</a>, or browse <a href="/blog/">everything on the blog</a>.</p>
<div class="note independent-note">7 Brews Menu US is an independent guide, not affiliated with 7 Brew Coffee. Deal terms above are from 7 Brew's official whats-new page, checked November 2, 2026. Participation varies by stand.</div>
</main>'''

# splice: december body = <body><header...> MAIN </main><footer...
pre_main, rest2 = body_after_head.split('<main', 1)
_, post_main = rest2.split('</main>', 1)
new_doc = h + '</head>' + pre_main + main + post_main
assert new_doc.count('Veterans Day') >= 10 and 'december-drinks' not in new_doc
open('blog/veterans-day.html', 'w', encoding='utf-8').write(new_doc)
print("blog/veterans-day.html written", len(new_doc))
