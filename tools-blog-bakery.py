#!/usr/bin/env python3
"""Build /blog/bakery-menu from the december-drinks shell.
Facts (official 7brew.com/whats-new + Business Wire release, checked 2026-11-02):
5 items $3 each, launched Nov 1 2026, served chilled, cannot be warmed, 50 points each,
Muffin Tops discontinued with this update, NO official calories/allergens published."""
import json, re

TITLE = "7 Brew Bakery Menu: 5 New Treats at $3, and the End of Muffin Tops"
DESC = "7 Brew's first bakery menu is live: Blondie Bar, Brunette brownie bar, cookie bar and two loaves, $3 each, served chilled. Plus what happened to muffin tops."
URL = "https://7brewsmenuus.com/blog/bakery-menu"
IMG = "https://7brewsmenuus.com/assets/products/product-blondie.webp"
IMG_ALT = "7 Brew Blondie breve, the drink behind the $3 Blondie Bar on the first 7 Brew bakery menu"
DATE = "2026-11-02T12:15:00+05:00"

FAQS = [
    ("What is on the 7 Brew bakery menu?",
     "Five treats, all $3: the Blondie Bar, the Brunette Mocha Brownie Bar, the Chocolate Chunk Cookie Bar, the Banana Bread Mocha Chip Loaf and the Blueberry Streusel Loaf. The bakery line launched November 1, 2026 at participating stands."),
    ("How much do 7 Brew bakery items cost?",
     "$3 each, every item. It is a flat price across the whole bakery menu, bars and loaves alike."),
    ("Are 7 Brew bakery items warmed up?",
     "No. 7 Brew's official bakery FAQ says the items are served chilled and cannot be warmed. They come out of the case cold, and the stand cannot heat them for you."),
    ("Do 7 Brew bakery items earn rewards points?",
     "Yes. Each bakery item earns 50 rewards points, the same as a canned 7 Energy. Ten treats would be 500 points, halfway to the 1,000-point free drink."),
    ("What happened to 7 Brew muffin tops?",
     "They are discontinued. 7 Brew's official page says it plainly: as part of this update, Muffin Tops will no longer be available at 7 Brew stands. The five bakery items are the replacement, not an addition."),
    ("How many calories are in the 7 Brew bakery items?",
     "Nobody can tell you yet, including us. 7 Brew has not published calories or allergens for the bakery items, and they are not in the current official nutrition guide. Sites listing bakery calories right now are guessing. We will add the real numbers the day the official guide update lands."),
    ("Are the 7 Brew bakery items permanent?",
     "7 Brew has announced no end date, and the items are presented as a menu launch, not a limited run. That is not a promise they stay forever, but there is no announced finish date to plan around."),
]

shell = open('blog/december-drinks.html', encoding='utf-8').read()
head, rest = shell.split('</head>', 1)

h = head
h = h.replace("7 Brew December Drinks 2026: Expected Lineup, Dates and Last Year's Favorites", TITLE)
h = h.replace("7 Brew's December 2026 drinks are not announced yet. Here is when to expect them, the holiday regulars from the last two winters with their builds, and the December dates that matter, including Jackpot Day on Dec 7.", DESC)
h = h.replace("7 Brew November 2026: five new bakery treats at $3 each, six dessert drinks, double points Nov 7 and 50% off for veterans Nov 11. See the full lineup.", DESC)
h = h.replace("https://7brewsmenuus.com/blog/december-drinks", URL)
h = h.replace("December Drinks 2026", "Bakery Menu")
h = h.replace("https://7brewsmenuus.com/assets/products/product-cinnamonroll.webp", IMG)
h = h.replace("7 Brew Cinnamon Roll coffee, a winter staple while the December 2026 drinks are still unannounced", IMG_ALT)
h = h.replace("2026-10-29T20:45:00+05:00", DATE)
faq_json = {"@context": "https://schema.org", "@type": "FAQPage",
            "mainEntity": [{"@type": "Question", "name": q,
                            "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in FAQS]}
h = re.sub(r'\{"@context": "https://schema\.org", "@type": "FAQPage", "mainEntity": \[.*?\]\}',
           json.dumps(faq_json, ensure_ascii=False), h, count=1, flags=re.S)
assert FAQS[2][0] in h and 'december' not in h.lower().replace('december 7 is jackpot day', '')

faq_html = "\n".join(
    f'<div class="faq-item">\n<h3>{q}</h3>\n<p>{a}</p>\n</div>' for q, a in FAQS)

main = f'''<main class="container" id="main-content">
<nav aria-label="Breadcrumb" class="breadcrumb">
<a href="/">Home</a> <span aria-hidden="true">›</span> <a href="/blog/">Blog</a> <span aria-hidden="true">›</span> <span aria-current="page">Bakery Menu</span>
</nav>
<h1>7 Brew Bakery Menu: 5 New Treats at $3, and the End of Muffin Tops</h1>
<p class="updated-line">Published November 2, 2026 · Details checked against 7 Brew's official site today</p>
<p class="lead">7 Brew has food now, real food. The chain's first bakery menu launched November 1 with five treats, every one priced at $3: three bars and two loaves, built to pair with the drinks they are named after. And there is a trade buried in the launch that the headlines skipped. To make room, 7 Brew retired the muffin tops.</p>
<div class="note editorial-note"><strong>How to read this page:</strong> prices, serving style and points come from 7 Brew's official bakery page and FAQ. Calories and allergens have NOT been published for any bakery item. Where a fact is not official yet, this page says so instead of filling the gap.</div>
<div class="table-responsive">
<table>
<thead><tr><th>Bakery at a glance</th><th>The short version</th></tr></thead>
<tbody>
<tr><td>Launched</td><td>Sunday, November 1, 2026, at participating stands</td></tr>
<tr><td>The menu</td><td>5 items: Blondie Bar, Brunette Mocha Brownie Bar, Chocolate Chunk Cookie Bar, Banana Bread Mocha Chip Loaf, Blueberry Streusel Loaf</td></tr>
<tr><td>Price</td><td>$3 each, flat across the whole menu</td></tr>
<tr><td>Served</td><td>Chilled. The items cannot be warmed</td></tr>
<tr><td>Rewards</td><td>50 points per item</td></tr>
<tr><td>Replaced</td><td>Muffin Tops, discontinued with this launch</td></tr>
<tr><td>Calories</td><td>Not published yet by 7 Brew</td></tr>
</tbody>
</table>
</div>
<div class="section-header">
<h2 class="section-title">The five items, one by one</h2>
</div>
<p><strong>Blondie Bar.</strong> The bakery version of the Blondie, the caramel and vanilla breve that is close to the chain's signature drink. If you only try one item, the pairing logic says make it this one with the drink beside it.</p>
<p><strong>Brunette Mocha Brownie Bar.</strong> A brownie built on the Brunette, 7 Brew's hazelnut, salted caramel and chocolate mocha. The richest-sounding item on the case, and the one early tasters keep posting.</p>
<p><strong>Chocolate Chunk Cookie Bar.</strong> The safe order. A cookie in bar form, no coffee flavors to argue with, built for the passenger who did not come for coffee.</p>
<p><strong>Banana Bread Mocha Chip Loaf.</strong> A sliced loaf with a mocha chip run through it, matching the Banana Bread drink on the coffee side of the menu.</p>
<p><strong>Blueberry Streusel Loaf.</strong> The fruit option, a streusel-topped loaf. The one to grab if the bars all sound like dessert and you want something that passes for breakfast.</p>
<div class="section-header">
<h2 class="section-title">The detail the headlines skipped: muffin tops are gone</h2>
</div>
<p>For years, the entire 7 Brew food menu was three muffin tops. The bakery launch ends that. 7 Brew's own page answers it in its FAQ, in one flat sentence: as part of this update, Muffin Tops will no longer be available at 7 Brew stands.</p>
<p>So this is a swap, not an expansion. If your stand still has muffin tops out, it is selling through the last of them. When they are gone from the case, they are gone. The new items are bigger, priced a flat $3, and there are five of them instead of three, but anyone whose order was a Blueberry Muffin Top and a coffee just lost their order.</p>
<div class="section-header">
<h2 class="section-title">What we do not know yet</h2>
</div>
<p>Two gaps matter, and both are 7 Brew's to close. First, nutrition: no calories, sugar or allergen data exists for the bakery items in the current official guide, so any site quoting you a Blondie Bar calorie count today invented it. Second, availability: the launch is at participating stands, and 7 Brew has not published a stand list. Your stand either has the case stocked or it does not, and the fastest check is the window.</p>
<p>One date to mark: on Black Friday, November 27, the bakery items go buy-one-get-one free, up to buy three get three. That deal is on 7 Brew's official page and almost none of the launch coverage mentioned it. Our <a href="/deals">deals page</a> tracks it from here.</p>
<div class="section-header">
<h2 class="section-title">Bakery menu FAQ</h2>
</div>
{faq_html}
<div class="section-header">
<h2 class="section-title">More from the blog</h2>
</div>
<p>The bakery launched alongside <a href="/november-drinks">the November drinks lineup</a>, the evergreen food picture is on our <a href="/food-menu">7 Brew food menu page</a>, and the full blog is <a href="/blog/">here</a>.</p>
<div class="note independent-note">7 Brews Menu US is an independent guide, not affiliated with 7 Brew Coffee. Bakery facts above are from 7 Brew's official whats-new page and launch release, checked November 2, 2026.</div>
</main>'''

pre_main, rest2 = rest.split('<main', 1)
_, post_main = rest2.split('</main>', 1)
new_doc = h + '</head>' + pre_main + main + post_main
assert new_doc.count('Bakery') >= 10 and 'december-drinks' not in new_doc
open('blog/bakery-menu.html', 'w', encoding='utf-8').write(new_doc)
print("blog/bakery-menu.html written", len(new_doc))
