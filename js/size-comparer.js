// Size comparison tool for /sizes-caffeine. Reads OFFICIAL_NUTRITION, 7 Brew's
// own published nutrition data. Ounce figures are the ones the page itself
// states; 7 Brew publishes no ounce figure for the kids cup, so it shows "—"
// rather than a guess.
(function () {
  'use strict';
  if (typeof OFFICIAL_NUTRITION === 'undefined') return;
  var root = document.getElementById('sizeComparer');
  if (!root) return;

  var OZ = {
    Hot:   { kids: null, small: 12, medium: 16, large: 20 },
    Iced:  { kids: null, small: 16, medium: 24, large: 32 }
  };
  var ORDER = ['kids', 'small', 'medium', 'large'];
  var LABEL = { kids: 'Kids', small: 'Small', medium: 'Medium', large: 'Large' };

  var drink = document.getElementById('szDrink');
  var tempRow = document.getElementById('szTemps');
  var temp = null;

  function rowsFor(name) {
    return OFFICIAL_NUTRITION.filter(function (r) { return r.name === name; });
  }
  function ozFor(size, t) {
    var map = t === 'Hot' ? OZ.Hot : OZ.Iced;   // blended is poured in the iced cup
    return map[size];
  }
  function set(id, txt) { var el = document.getElementById(id); if (el) el.textContent = txt; }

  function drawTemps() {
    var temps = [];
    rowsFor(drink.value).forEach(function (r) { if (temps.indexOf(r.temperature) === -1) temps.push(r.temperature); });
    if (temps.indexOf(temp) === -1) temp = temps[0] || null;
    tempRow.innerHTML = temps.map(function (t) {
      return '<button class="calc-pill' + (t === temp ? ' active' : '') + '" data-sz-temp="' + t + '" type="button">' + t + '</button>';
    }).join('');
  }

  function render() {
    drawTemps();
    var rows = rowsFor(drink.value).filter(function (r) { return r.temperature === temp; });
    var bySize = {};
    rows.forEach(function (r) { bySize[r.size] = r; });

    set('szTitle', drink.value);
    set('szSubtitle', 'All sizes, ' + (temp || '').toLowerCase());

    var body = document.getElementById('szBody');
    var html = '';
    ORDER.forEach(function (sz) {
      var r = bySize[sz];
      if (!r) return;
      var oz = ozFor(sz, temp);
      var highlight = sz === 'large' ? ' style="background:#F0FDF4;"' : '';
      html += '<tr' + highlight + '>' +
        '<td style="text-align:left;"><strong>' + LABEL[sz] + '</strong></td>' +
        '<td>' + (oz ? oz + ' oz' : '\u2014') + '</td>' +
        '<td>' + r.calories + '</td>' +
        '<td>' + r.caffeine + ' mg</td>' +
        '<td>' + r.sugar + 'g</td>' +
        '</tr>';
    });
    body.innerHTML = html;

    // what sizing up actually costs you
    var s = bySize.small, l = bySize.large;
    var v = document.getElementById('szVerdict');
    if (s && l) {
      var ozS = ozFor('small', temp), ozL = ozFor('large', temp);
      var calJump = l.calories - s.calories;
      var cafJump = l.caffeine - s.caffeine;
      // only call it "doubles" when it actually doubles — hot goes 12 oz to 20 oz
      var verb = (ozS && ozL && ozL === ozS * 2) ? ' doubles the cup from ' : ' takes the cup from ';
      v.innerHTML = 'Going from a small to a large' +
        (ozS && ozL ? verb + ozS + ' oz to ' + ozL + ' oz' : '') +
        ' and adds <strong>' + calJump + ' calories</strong>' +
        (cafJump > 0 ? ' and <strong>' + cafJump + ' mg of caffeine</strong>' : '') + '.';
    } else {
      v.innerHTML = '';
    }
  }

  drink.addEventListener('change', function () { render(); });
  tempRow.addEventListener('click', function (e) {
    var b = e.target.closest('[data-sz-temp]');
    if (!b) return;
    temp = b.getAttribute('data-sz-temp');
    render();
  });
  render();
})();
