// Sugar-free finder for /sugar-free. Compares each drink with its Sugar-Free
// counterpart in OFFICIAL_NUTRITION, 7 Brew's own published nutrition data.
(function () {
  'use strict';
  if (typeof OFFICIAL_NUTRITION === 'undefined') return;
  var root = document.getElementById('sugarFreeFinder');
  if (!root) return;

  var drink = document.getElementById('sfDrink');
  var sizeRow = document.getElementById('sfSizes');
  var size = 'medium';

  function pick(name, sz) {
    var hit = OFFICIAL_NUTRITION.filter(function (r) { return r.name === name && r.size === sz; });
    return hit.length ? hit[0] : null;
  }
  function sizesFor(name) {
    var out = {};
    OFFICIAL_NUTRITION.forEach(function (r) { if (r.name === name) out[r.size] = true; });
    return out;
  }
  function set(id, txt) { var el = document.getElementById(id); if (el) el.textContent = txt; }

  function drawSizes() {
    var have = sizesFor(drink.value);
    var buttons = sizeRow.querySelectorAll('[data-sf-size]');
    var first = null;
    Array.prototype.forEach.call(buttons, function (b) {
      var sz = b.getAttribute('data-sf-size');
      var ok = !!have[sz];
      b.disabled = !ok;
      b.style.opacity = ok ? '' : '0.35';
      b.style.cursor = ok ? '' : 'not-allowed';
      if (ok && !first) first = sz;
    });
    if (!have[size]) size = first || 'medium';
    Array.prototype.forEach.call(buttons, function (b) {
      b.classList.toggle('active', b.getAttribute('data-sf-size') === size);
    });
  }

  function render() {
    drawSizes();
    var name = drink.value;
    var reg = pick(name, size);
    var sf = pick('Sugar-Free ' + name, size);
    if (!reg) return;

    set('sfSubtitle', size.charAt(0).toUpperCase() + size.slice(1));
    set('sfRegSugar', reg.sugar + 'g');
    set('sfRegCal', reg.calories);
    var v = document.getElementById('sfVerdict');

    if (sf) {
      var saved = reg.sugar - sf.sugar;
      var cal = reg.calories - sf.calories;
      set('sfTitle', 'Yes — sugar-free available');
      set('sfSaved', saved + 'g');
      set('sfNewSugar', sf.sugar + 'g');
      set('sfNewCal', sf.calories);
      v.innerHTML = 'Ask for a <strong>sugar-free ' + name + '</strong> and you drop <strong>' + saved +
        'g of sugar</strong>' + (cal > 0 ? ' and <strong>' + cal + ' calories</strong>' : '') +
        '. The ' + sf.sugar + 'g left is the natural sugar in the milk, not added syrup.';
    } else if (reg.sugar <= 2) {
      // no sugar-free version listed because the drink has no sugar to remove
      set('sfTitle', 'Already sugar-free');
      set('sfSaved', '0g');
      set('sfNewSugar', reg.sugar + 'g');
      set('sfNewCal', reg.calories);
      v.innerHTML = 'There is no sugar-free <strong>' + name + '</strong> because it does not need one — a ' +
        size + ' already has ' + (reg.sugar === 0 ? '<strong>no sugar at all</strong>' :
        'just <strong>' + reg.sugar + 'g of sugar</strong>') + '. Order it as it comes.';
    } else {
      set('sfTitle', 'No sugar-free version');
      set('sfSaved', '—');
      set('sfNewSugar', '—');
      set('sfNewCal', '—');
      var lower = OFFICIAL_NUTRITION.filter(function (r) {
        return r.size === size && /^Sugar-Free/.test(r.name) && r.sugar < reg.sugar;
      }).sort(function (a, b) { return a.sugar - b.sugar; });
      v.innerHTML = '7 Brew does not list a sugar-free <strong>' + name + '</strong>, and a ' + size +
        ' carries <strong>' + reg.sugar + 'g of sugar</strong>.' +
        (lower.length ? ' The lowest-sugar drink on the board is <strong>' + lower[0].name +
          '</strong> at ' + lower[0].sugar + 'g.' : '');
    }
  }

  drink.addEventListener('change', function () { render(); });
  sizeRow.addEventListener('click', function (e) {
    var b = e.target.closest('[data-sf-size]');
    if (!b || b.disabled) return;
    size = b.getAttribute('data-sf-size');
    render();
  });
  render();
})();
