// Caffeine calculator for /energy-drinks. Reads OFFICIAL_NUTRITION, which is
// 7 Brew's own published nutrition data, so nothing here is an estimate.
(function () {
  'use strict';
  if (typeof OFFICIAL_NUTRITION === 'undefined') return;
  var root = document.getElementById('caffeineCalculator');
  if (!root) return;

  var DRIP = 95, REDBULL = 80, SHOT = 64, LIMIT = 400;
  var drink = document.getElementById('cafDrink');
  var sizeRow = document.getElementById('cafSizes');
  var tempRow = document.getElementById('cafTemps');
  var size = 'medium', temp = null;

  function rowsFor(name, sz) {
    return OFFICIAL_NUTRITION.filter(function (r) { return r.name === name && r.size === sz; });
  }
  function sizesFor(name) {
    var out = {};
    OFFICIAL_NUTRITION.forEach(function (r) { if (r.name === name) out[r.size] = true; });
    return out;
  }
  function fmt(n, dp) { return (Math.round(n * Math.pow(10, dp)) / Math.pow(10, dp)).toFixed(dp); }
  function set(id, txt) { var el = document.getElementById(id); if (el) el.textContent = txt; }

  function drawSizes() {
    var have = sizesFor(drink.value);
    var buttons = sizeRow.querySelectorAll('[data-caf-size]');
    var firstAvailable = null;
    Array.prototype.forEach.call(buttons, function (b) {
      var sz = b.getAttribute('data-caf-size');
      var ok = !!have[sz];
      b.disabled = !ok;
      b.style.opacity = ok ? '' : '0.35';
      b.style.cursor = ok ? '' : 'not-allowed';
      if (ok && !firstAvailable) firstAvailable = sz;
    });
    if (!have[size]) size = firstAvailable || 'medium';
    Array.prototype.forEach.call(buttons, function (b) {
      b.classList.toggle('active', b.getAttribute('data-caf-size') === size);
    });
  }

  function drawTemps() {
    var rows = rowsFor(drink.value, size);
    var temps = [];
    rows.forEach(function (r) { if (temps.indexOf(r.temperature) === -1) temps.push(r.temperature); });
    if (temps.indexOf(temp) === -1) temp = temps[0] || null;
    document.getElementById('cafTempGroup').style.display = temps.length > 1 ? '' : 'none';
    tempRow.innerHTML = temps.map(function (t) {
      return '<button class="calc-pill' + (t === temp ? ' active' : '') + '" data-caf-temp="' + t + '" type="button">' + t + '</button>';
    }).join('');
  }

  function render() {
    drawSizes();
    drawTemps();
    var rows = rowsFor(drink.value, size);
    var row = null;
    for (var i = 0; i < rows.length; i++) { if (rows[i].temperature === temp) { row = rows[i]; break; } }
    if (!row) row = rows[0];
    if (!row) return;

    var mg = row.caffeine;
    set('cafMg', mg);
    set('cafSubtitle', (size.charAt(0).toUpperCase() + size.slice(1)) + ' ' + row.temperature);
    set('cafCoffee', mg ? fmt(mg / DRIP, 1) : '0');
    set('cafRedBull', mg ? fmt(mg / REDBULL, 1) : '0');
    set('cafShots', mg ? fmt(mg / SHOT, 1) : '0');
    set('cafPct', Math.round(mg / LIMIT * 100) + '%');

    var v = document.getElementById('cafVerdict');
    var name = row.name;
    if (mg === 0) {
      v.innerHTML = '<strong>' + name + '</strong> is caffeine-free in this size, so it is safe for kids and for a late-evening order.';
    } else if (mg >= LIMIT) {
      v.innerHTML = 'A ' + size + ' <strong>' + name + '</strong> is <strong>' + mg + ' mg</strong> — on its own at or above the 400 mg a day US health guidance suggests healthy adults stay under. Worth making it your only caffeine of the day.';
    } else if (mg >= LIMIT / 2) {
      v.innerHTML = 'A ' + size + ' <strong>' + name + '</strong> is <strong>' + mg + ' mg</strong>, over half the 400 mg daily guidance in one cup. Two of these in a day puts you past it.';
    } else {
      v.innerHTML = 'A ' + size + ' <strong>' + name + '</strong> is <strong>' + mg + ' mg</strong>, about ' + fmt(mg / DRIP, 1) + ' cups of regular drip coffee.';
    }
  }

  drink.addEventListener('change', function () { render(); });
  sizeRow.addEventListener('click', function (e) {
    var b = e.target.closest('[data-caf-size]');
    if (!b || b.disabled) return;
    size = b.getAttribute('data-caf-size');
    render();
  });
  tempRow.addEventListener('click', function (e) {
    var b = e.target.closest('[data-caf-temp]');
    if (!b) return;
    temp = b.getAttribute('data-caf-temp');
    render();
  });
  render();
})();
