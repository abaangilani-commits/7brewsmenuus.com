/* 7 Brew near-me finder. Runs fully in the visitor's browser.
   Stand data: assets/locations.json (official locator snapshot, checked September 21, 2026).
   GPS coordinates never leave the device. A ZIP search sends only the ZIP code
   to the public Zippopotam.us lookup to get its coordinates. */
(function () {
  "use strict";

  var TZ = {
    AL: "America/Chicago", AZ: "America/Phoenix", AR: "America/Chicago",
    CO: "America/Denver", CT: "America/New_York", FL: "America/New_York",
    GA: "America/New_York", IA: "America/Chicago", IL: "America/Chicago",
    IN: "America/Indiana/Indianapolis", KS: "America/Chicago", KY: "America/New_York",
    LA: "America/Chicago", MA: "America/New_York", MD: "America/New_York",
    MI: "America/Detroit", MN: "America/Chicago", MO: "America/Chicago",
    MS: "America/Chicago", MT: "America/Denver", NC: "America/New_York",
    ND: "America/Chicago", NE: "America/Chicago", NJ: "America/New_York",
    NM: "America/Denver", NY: "America/New_York", OH: "America/New_York",
    OK: "America/Chicago", PA: "America/New_York", SC: "America/New_York",
    SD: "America/Chicago", TN: "America/Chicago", TX: "America/Chicago",
    UT: "America/Denver", VA: "America/New_York", WI: "America/Chicago",
    WV: "America/New_York", WY: "America/Denver"
  };
  var DAYCODES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  var stands = null;

  var statusEl = document.getElementById("nmStatus");
  var resultsEl = document.getElementById("nmResults");
  var inputEl = document.getElementById("nmQuery");

  function setStatus(msg) { if (statusEl) statusEl.textContent = msg; }

  function haversineMiles(lat1, lon1, lat2, lon2) {
    var R = 3958.8, rad = Math.PI / 180;
    var dp = (lat2 - lat1) * rad, dl = (lon2 - lon1) * rad;
    var a = Math.sin(dp / 2) * Math.sin(dp / 2) +
      Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dl / 2) * Math.sin(dl / 2);
    return 2 * R * Math.asin(Math.sqrt(a));
  }

  function loadStands() {
    if (stands) return Promise.resolve(stands);
    return fetch("assets/locations.json")
      .then(function (r) { return r.json(); })
      .then(function (d) {
        stands = d.locations.filter(function (l) {
          return l.geo && typeof l.geo.latitude === "number";
        });
        return stands;
      });
  }

  function standNow(state) {
    try {
      var parts = new Intl.DateTimeFormat("en-US", {
        timeZone: TZ[state] || "America/Chicago",
        weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false
      }).formatToParts(new Date());
      var wd = "", hh = 0, mm = 0;
      parts.forEach(function (p) {
        if (p.type === "weekday") wd = p.value.slice(0, 2);
        if (p.type === "hour") hh = parseInt(p.value, 10) % 24;
        if (p.type === "minute") mm = parseInt(p.value, 10);
      });
      return { code: wd, minutes: hh * 60 + mm };
    } catch (e) {
      return null;
    }
  }

  function todaysHours(stand) {
    var now = standNow(stand.address.addressRegion);
    if (!now || !stand.hours) return null;
    for (var i = 0; i < stand.hours.length; i++) {
      var entry = stand.hours[i];
      var m = entry.match(/^([A-Za-z, ]+)\s+(\d{2}):(\d{2})-(\d{2}):(\d{2})$/);
      if (!m) continue;
      var days = m[1].split(",").map(function (s) { return s.trim(); });
      if (days.indexOf(now.code) === -1) continue;
      var open = parseInt(m[2], 10) * 60 + parseInt(m[3], 10);
      var close = parseInt(m[4], 10) * 60 + parseInt(m[5], 10);
      return {
        open: open, close: close,
        isOpen: now.minutes >= open && now.minutes < close
      };
    }
    return null;
  }

  function fmtTime(mins) {
    var h = Math.floor(mins / 60), m = mins % 60;
    var suffix = h >= 12 ? "PM" : "AM";
    var h12 = h % 12; if (h12 === 0) h12 = 12;
    return h12 + ":" + (m < 10 ? "0" : "") + m + " " + suffix;
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function render(lat, lon, originLabel) {
    var ranked = stands.map(function (s) {
      return { s: s, d: haversineMiles(lat, lon, s.geo.latitude, s.geo.longitude) };
    }).sort(function (a, b) { return a.d - b.d; }).slice(0, 10);

    var html = "";
    ranked.forEach(function (item, idx) {
      var s = item.s, a = s.address;
      var addr = a.streetAddress + ", " + a.addressLocality + ", " +
        a.addressRegion + " " + (a.postalCode || "");
      var th = todaysHours(s);
      var hoursLine = "Hours not listed";
      var badge = "";
      if (th) {
        hoursLine = "Today: " + fmtTime(th.open) + " – " + fmtTime(th.close);
        badge = th.isOpen
          ? ' <span class="nm-open">Open now</span>'
          : ' <span class="nm-closed">Closed now</span>';
      }
      var dir = "https://www.google.com/maps/dir/?api=1&destination=" +
        encodeURIComponent("7 Brew Coffee, " + addr);
      html += '<div class="nm-card">' +
        '<p class="nm-card-head"><strong>' + (idx + 1) + ". " +
        esc(a.addressLocality) + ", " + esc(a.addressRegion) + "</strong>" +
        ' <span class="nm-dist">' + item.d.toFixed(1) + " mi</span></p>" +
        '<p class="nm-addr">' + esc(addr) + "</p>" +
        '<p class="nm-hours">' + hoursLine + badge + "</p>" +
        '<p class="nm-links"><a href="' + dir + '" rel="noopener" target="_blank">Get directions</a>' +
        ' · <a href="' + esc(s.url) + '" rel="noopener" target="_blank">Official stand page</a></p>' +
        "</div>";
    });
    resultsEl.innerHTML = html;
    var nearest = ranked[0];
    setStatus("Closest stands to " + originLabel + ". Nearest: " +
      nearest.s.address.addressLocality + ", " + nearest.s.address.addressRegion +
      ", " + nearest.d.toFixed(1) + " miles away. Distances are straight-line; driving distance is longer.");
  }

  function search() {
    var q = (inputEl.value || "").trim();
    if (!q) { setStatus("Type a ZIP code or a city name, or tap Use my location."); return; }
    loadStands().then(function () {
      if (/^\d{5}$/.test(q)) {
        setStatus("Looking up ZIP " + q + "…");
        fetch("https://api.zippopotam.us/us/" + q)
          .then(function (r) { if (!r.ok) throw new Error("zip"); return r.json(); })
          .then(function (d) {
            var p = d.places[0];
            render(parseFloat(p.latitude), parseFloat(p.longitude),
              p["place name"] + ", " + p["state abbreviation"] + " " + q);
          })
          .catch(function () {
            setStatus("That ZIP did not resolve. Try a city name instead, like Dallas or Rogers.");
          });
        return;
      }
      var stateHint = null;
      var cityPart = q;
      var comma = q.lastIndexOf(",");
      if (comma > -1) {
        cityPart = q.slice(0, comma).trim();
        var st = q.slice(comma + 1).trim().toUpperCase();
        if (/^[A-Z]{2}$/.test(st)) stateHint = st;
      }
      var want = cityPart.toLowerCase();
      var matches = stands.filter(function (s) {
        return s.address.addressLocality.toLowerCase() === want &&
          (!stateHint || s.address.addressRegion === stateHint);
      });
      if (!matches.length) {
        setStatus("No stand city matches \"" + q + "\" in the September 2026 snapshot. " +
          "Try the closest bigger city, or browse the full directory by state.");
        resultsEl.innerHTML = "";
        return;
      }
      var lat = 0, lon = 0;
      matches.forEach(function (s) { lat += s.geo.latitude; lon += s.geo.longitude; });
      var cityName = matches[0].address.addressLocality + ", " + matches[0].address.addressRegion;
      render(lat / matches.length, lon / matches.length, cityName);
    }).catch(function () {
      setStatus("The stand data could not load. Check your connection and try again.");
    });
  }

  var geoBtn = document.getElementById("nmGeo");
  if (geoBtn) geoBtn.addEventListener("click", function () {
    if (!navigator.geolocation) {
      setStatus("This browser cannot share a location. Search by ZIP or city instead.");
      return;
    }
    setStatus("Getting your location…");
    loadStands().then(function () {
      navigator.geolocation.getCurrentPosition(function (pos) {
        render(pos.coords.latitude, pos.coords.longitude, "your location");
      }, function () {
        setStatus("Location was not shared. Search by ZIP or city instead; nothing is stored either way.");
      }, { timeout: 10000, maximumAge: 300000 });
    });
  });

  var goBtn = document.getElementById("nmGo");
  if (goBtn) goBtn.addEventListener("click", search);
  if (inputEl) inputEl.addEventListener("keydown", function (e) {
    if (e.key === "Enter") { e.preventDefault(); search(); }
  });
})();
