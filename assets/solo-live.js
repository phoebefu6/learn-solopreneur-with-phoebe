/* solo-live.js - Marlow's capacity ledger for learn-solopreneur-with-phoebe
 *
 * MODELLED, end to end. Marlow is a constructed solo data consultant; no row here is a real
 * business. The page runs a seeded 52-week simulation in the browser: every week, demand arrives
 * for each offer Marlow sells, and a stated booking rule decides what Marlow takes on inside a
 * fixed weekly capacity shared by billable work, sales, admin and product building.
 *
 * Illustrative, not financial or tax advice. Money is in whole dollars; hours are kept in integer
 * tenths so the browser and the Python reference (materials/solo_reference.py) agree exactly.
 *
 * Booking rule, in priority order each week:
 *   1 product building (fixed schedule)   2 retainer delivery   3 a retainer won this week (sales)
 *   4 active project delivery             5 a new project (sales + first week)  6 productized units
 *   7 the anchor hourly client (partial hours allowed)   8 small hourly requests (whole or not at all)
 * Admin = a base per week + a slice per distinct client billed that week. A request is taken only
 * if its hours, its sales hours and any new client's admin slice fit in what is left of capacity.
 * Anti-lever "say yes to every hourly client": all hourly requests are taken whatever the capacity,
 *   plus a pool of discount requests normally turned away.
 * Break button "lose the biggest client": the client with the most revenue in the same run without
 *   the break sends no work from week 27; the bench prints the revenue hole and the runway.
 */
(function (root) {
  "use strict";

  var D = {
    weeks: 52, capacity: 45, seed: 20261009,
    adminBase: 60, adminPerClient: 5,           /* tenths of an hour */
    autoShare: 40, autoSetup: 200,              /* percent cut, tenths of an hour in week 1 */
    hourlyPrice: 110, discountPrice: 85, smallSales: 5,   /* sales tenths per small request */
    projPrice: 1350, projWeeks: 4, projHours: 90, projSales: 50, projMaxActive: 2,
    prodPrice: 1800, prodHours: 70, prodSales: 10, prodBuildWeeks: 8, prodBuildHours: 80, prodFrom: 9, prodMax: 2,
    retPrice: 700, retHours: 50, retSales: 80, retWeeks: [5, 14, 30],
    weeklyCost: 2000, startCash: 8000, breakWeek: 27
  };

  var RUNGS = [
    { id: 1, label: "All hourly", proj: false, prod: false, ret: false, auto: false },
    { id: 2, label: "+ fixed-scope projects", proj: true, prod: false, ret: false, auto: false },
    { id: 3, label: "+ a productized offer", proj: true, prod: true, ret: false, auto: false },
    { id: 4, label: "+ retainers", proj: true, prod: true, ret: true, auto: false },
    { id: 5, label: "+ automation on admin", proj: true, prod: true, ret: true, auto: true }
  ];

  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function ri(r, n) { return Math.floor(r() * n); }

  /* Demand is drawn once, the same for every rung, so rungs differ only by what Marlow sells. */
  function demand(p) {
    var r = mulberry32(p.seed), out = [];
    for (var w = 1; w <= p.weeks; w++) {
      var wk = { anchor: 140 + 10 * ri(r, 9), small: [], disc: [], proj: false, prod: 0 };
      var n = ri(r, 4);
      for (var i = 0; i < n; i++) wk.small.push({ c: "S" + (1 + ri(r, 6)), h: 10 * (4 + ri(r, 5)) });
      var m = ri(r, 3);
      for (var j = 0; j < m; j++) wk.disc.push({ c: "D" + (1 + ri(r, 6)), h: 10 * (3 + ri(r, 4)) });
      wk.proj = r() < 0.35;
      wk.prod = ri(r, 3);
      out.push(wk);
    }
    return out;
  }

  function simulate(p, rung, anti, lost) {
    var dem = demand(p);
    var cap = p.capacity * 10;
    var adminBase = rung.auto ? Math.round(p.adminBase * (100 - p.autoShare) / 100) : p.adminBase;
    var adminPer = rung.auto ? Math.round(p.adminPerClient * (100 - p.autoShare) / 100) : p.adminPerClient;
    var projects = [], retainers = [], projN = 0, prodN = 0;
    var byClient = {}, weeks = [];
    var tot = { rev: 0, bill: 0, sales: 0, admin: 0, build: 0, over: 0, turned: 0 };

    for (var w = 1; w <= p.weeks; w++) {
      var dm = dem[w - 1];
      var gone = lost && w >= p.breakWeek ? lost : null;
      var h = { bill: 0, sales: 0, build: 0 }, rev = 0, clients = {}, nClients = 0;
      function used() { return h.bill + h.sales + h.build + adminBase + adminPer * nClients; }
      function bill(c, hours, money) {
        h.bill += hours; rev += money;
        byClient[c] = (byClient[c] || 0) + money;
        if (!clients[c]) { clients[c] = true; nClients++; }
      }
      function fits(c, need) { return used() + need + (clients[c] ? 0 : adminPer) <= cap; }

      if (w === 1 && rung.auto) h.build += p.autoSetup;
      if (rung.prod && w <= p.prodBuildWeeks) h.build += p.prodBuildHours;

      if (rung.ret) {
        retainers.forEach(function (c) { if (c !== gone) bill(c, p.retHours, p.retPrice); });
        var k = p.retWeeks.indexOf(w);
        if (k >= 0) { var rc = "R" + (k + 1); if (rc !== gone) { h.sales += p.retSales; retainers.push(rc); } }
      }
      if (rung.proj) {
        projects = projects.filter(function (pr) { return pr.left > 0; });
        projects.forEach(function (pr) { bill(pr.c, p.projHours, p.projPrice); pr.left--; });
        if (dm.proj) {
          var pc = "P" + (projN + 1);
          if (projects.length < p.projMaxActive && fits(pc, p.projSales + p.projHours)) {
            projN++; h.sales += p.projSales; bill(pc, p.projHours, p.projPrice);
            projects.push({ c: pc, left: p.projWeeks - 1 });
          } else tot.turned++;
        }
      }
      if (rung.prod && w >= p.prodFrom) {
        for (var u = 0; u < Math.min(dm.prod, p.prodMax); u++) {
          var qc = "Q" + (prodN + 1);
          if (fits(qc, p.prodHours + p.prodSales)) { prodN++; h.sales += p.prodSales; bill(qc, p.prodHours, p.prodPrice); }
          else tot.turned++;
        }
      }
      if (gone !== "A") {
        var aH = dm.anchor;
        if (!anti) {
          var room = cap - used() - (clients.A ? 0 : adminPer);
          aH = Math.max(0, Math.min(aH, Math.floor(room / 10) * 10));
        }
        if (aH > 0) bill("A", aH, p.hourlyPrice * aH / 10);
      }
      dm.small.forEach(function (q) {
        if (q.c === gone) return;
        if (anti || fits(q.c, q.h + p.smallSales)) { h.sales += p.smallSales; bill(q.c, q.h, p.hourlyPrice * q.h / 10); }
        else tot.turned++;
      });
      if (anti) dm.disc.forEach(function (q) {
        if (q.c === gone) return;
        h.sales += p.smallSales; bill(q.c, q.h, p.discountPrice * q.h / 10);
      });

      var admin = adminBase + adminPer * nClients;
      var all = h.bill + h.sales + h.build + admin;
      tot.rev += rev; tot.bill += h.bill; tot.sales += h.sales; tot.admin += admin; tot.build += h.build;
      if (all > cap) tot.over++;
      weeks.push({ w: w, rev: rev, hours: all });
    }
    var hours = tot.bill + tot.sales + tot.admin + tot.build;
    var top = null, topRev = -1;
    Object.keys(byClient).sort().forEach(function (c) { if (byClient[c] > topRev) { topRev = byClient[c]; top = c; } });
    return {
      revenue: tot.rev, hoursT: hours, billT: tot.bill, salesT: tot.sales, adminT: tot.admin, buildT: tot.build,
      rateCents: Math.round(tot.rev * 1000 / hours), billShare: Math.round(tot.bill * 1000 / hours),
      over: tot.over, turned: tot.turned, top: top, topShare: Math.round(topRev * 1000 / tot.rev),
      clients: Object.keys(byClient).length, weeks: weeks
    };
  }

  function sumRev(ws, a, b) { var s = 0; ws.forEach(function (x) { if (x.w >= a && x.w <= b) s += x.rev; }); return s; }

  function run(p, rungId, anti, brk) {
    var rung = RUNGS[rungId - 1];
    var base = simulate(p, rung, anti, null);
    if (!brk) return { res: base, base: base };
    var res = simulate(p, rung, anti, base.top);
    var bw = p.breakWeek;
    var hole = sumRev(base.weeks, bw, p.weeks) - sumRev(res.weeks, bw, p.weeks);
    var cash = p.startCash + sumRev(res.weeks, 1, bw - 1) - p.weeklyCost * (bw - 1);
    var after = sumRev(res.weeks, bw, p.weeks);
    var n = p.weeks - bw + 1;
    var netWeek = after - p.weeklyCost * n;           /* whole-period net after the loss */
    var runway = netWeek >= 0 ? null : Math.floor(cash * n / -netWeek);
    res.brk = { lost: base.top, hole: hole, cash26: cash, weeklyAfter: Math.round(after / n), runway: runway };
    return { res: res, base: base };
  }

  function canon(p) {
    p = p || D;
    var out = { rungs: [] };
    RUNGS.forEach(function (r) {
      var a = run(p, r.id, false, false).res, b = run(p, r.id, false, true).res;
      out.rungs.push({ rung: r.id, label: r.label, revenue: a.revenue, hours: a.hoursT / 10, rate: a.rateCents / 100,
        over: a.over, topClient: a.top, topShare: a.topShare / 10, billShare: a.billShare / 10, turned: a.turned,
        lost: b.brk.lost, hole: b.brk.hole, cash26: b.brk.cash26, weeklyAfter: b.brk.weeklyAfter, runway: b.brk.runway });
    });
    [1, 5].forEach(function (k) {
      var a = run(p, k, true, false).res, b = run(p, k, true, true).res;
      out["anti" + k] = { revenue: a.revenue, hours: a.hoursT / 10, rate: a.rateCents / 100, over: a.over,
        topClient: a.top, topShare: a.topShare / 10, lost: b.brk.lost, hole: b.brk.hole, runway: b.brk.runway };
    });
    return out;
  }

  /* ---------------- widget ---------------- */
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function money(x) { return "$" + Math.round(x).toLocaleString("en-US"); }
  function hrs(t) { return (t / 10).toLocaleString("en-US", { maximumFractionDigits: 1 }); }
  var NAMES = { A: "the anchor client (hourly)", R1: "retainer client 1", R2: "retainer client 2", R3: "retainer client 3" };
  function cname(c) { return NAMES[c] || (c.charAt(0) === "P" ? "project client " + c.slice(1) : c.charAt(0) === "Q" ? "productized buyer " + c.slice(1) : c.charAt(0) === "S" ? "small hourly client " + c.slice(1) : "discount client " + c.slice(1)); }

  var rootEl, els = {}, state = { rung: 1, anti: false, brk: false, capacity: D.capacity, price: D.hourlyPrice };

  function params() { var p = {}; for (var k in D) p[k] = D[k]; p.capacity = state.capacity; p.hourlyPrice = state.price; return p; }

  function weekChart(r, cap) {
    var W = 420, H = 190, x0 = 30, y0 = 20, ph = 130, bw = 5, pt = 6.5, maxH = 75;
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Hours worked in each of 52 weeks against the weekly capacity line">';
    [0, 25, 50, 75].forEach(function (t) {
      var y = y0 + ph - ph * t / maxH;
      s += '<line class="sl-grid" x1="' + x0 + '" y1="' + y.toFixed(1) + '" x2="' + (x0 + 52 * pt) + '" y2="' + y.toFixed(1) + '"/>';
      s += '<text class="sl-tick" x="' + (x0 - 6) + '" y="' + (y + 4).toFixed(1) + '" text-anchor="end">' + t + '</text>';
    });
    r.weeks.forEach(function (wk, i) {
      var hh = Math.min(wk.hours / 10, maxH), bh = ph * hh / maxH;
      s += '<rect class="sl-bar' + (wk.hours > cap * 10 ? ' is-over' : '') + '" x="' + (x0 + i * pt).toFixed(1) + '" y="' + (y0 + ph - bh).toFixed(1) + '" width="' + bw + '" height="' + bh.toFixed(1) + '" rx="1"/>';
    });
    var cy = y0 + ph - ph * cap / maxH;
    s += '<line class="sl-cap" x1="' + x0 + '" y1="' + cy.toFixed(1) + '" x2="' + (x0 + 52 * pt) + '" y2="' + cy.toFixed(1) + '"/>';
    s += '<text class="sl-capl" x="' + (x0 + 52 * pt + 4) + '" y="' + (cy + 4).toFixed(1) + '">' + cap + ' h</text>';
    if (state.brk) {
      var bx = x0 + (D.breakWeek - 1) * pt - 1;
      s += '<line class="sl-brk" x1="' + bx + '" y1="' + y0 + '" x2="' + bx + '" y2="' + (y0 + ph) + '"/>';
    }
    s += '<text class="sl-tick" x="' + x0 + '" y="' + (y0 + ph + 18) + '">week 1</text>';
    s += '<text class="sl-tick" x="' + (x0 + 51 * pt + bw) + '" y="' + (y0 + ph + 18) + '" text-anchor="end">week 52</text>';
    s += '<text class="sl-tick" x="' + (x0 + 26 * pt) + '" y="' + (y0 + ph + 34) + '" text-anchor="middle">hours worked per week, all kinds</text>';
    return s + '</svg>';
  }

  function render() {
    var p = params(), out = run(p, state.rung, state.anti, state.brk), r = out.res;
    var ref = run(p, state.rung, false, false).res;
    els.rungs.forEach(function (l, i) { l.classList.toggle("is-on", i + 1 === state.rung); l.querySelector("input").checked = i + 1 === state.rung; });
    els.anti.classList.toggle("is-on", state.anti); els.brk.classList.toggle("is-on", state.brk);
    els.capOut.textContent = state.capacity + " h"; els.priceOut.textContent = "$" + state.price;

    var v, cls;
    if (state.brk) {
      v = "Modelled. Rung " + state.rung + (state.anti ? " with every hourly client taken" : "") + ": " + cname(r.brk.lost) + " stops sending work in week " + D.breakWeek + ". Revenue hole " + money(r.brk.hole) + " over the rest of the year; " +
        (r.brk.runway === null ? "what is left still covers the " + money(D.weeklyCost) + " weekly costs." : "at " + money(r.brk.weeklyAfter) + " a week, the cash on hand lasts about " + r.brk.runway + " weeks.");
      cls = r.brk.runway === null ? "is-ok" : "is-bad";
    } else if (state.anti) {
      v = "Modelled anti-lever. Saying yes to every hourly request: revenue " + money(ref.revenue) + " → " + money(r.revenue) + ", effective rate $" + (ref.rateCents / 100).toFixed(2) + " → $" + (r.rateCents / 100).toFixed(2) + ", weeks over capacity " + ref.over + " → " + r.over + ".";
      cls = "is-bad";
    } else {
      v = "Modelled. Rung " + state.rung + ", " + RUNGS[state.rung - 1].label.replace(/^\+ /, "adding ") + ": " + money(r.revenue) + " a year for " + hrs(r.hoursT) + " hours, an effective $" + (r.rateCents / 100).toFixed(2) + " per hour worked.";
      cls = state.rung === 1 ? "is-ok" : "is-good";
    }
    els.verdict.className = "mb-verdict " + cls; els.verdict.textContent = v;

    function metric(label, val, unit) {
      return '<div class="mb-metric"><span class="mb-mkind is-heuristic">modelled</span><span class="mb-mlabel">' + esc(label) + '</span><span class="mb-mvalue">' + esc(val) + '</span><span class="mb-munit">' + esc(unit) + '</span></div>';
    }
    els.metrics.innerHTML =
      metric("Annual revenue", money(r.revenue), "illustrative dollars") +
      metric("Total hours, all kinds", hrs(r.hoursT), "billable " + hrs(r.billT) + " · sales " + hrs(r.salesT) + " · admin " + hrs(r.adminT) + " · building " + hrs(r.buildT)) +
      metric("Effective hourly rate", "$" + (r.rateCents / 100).toFixed(2), "revenue ÷ ALL hours, not billable hours") +
      metric("Weeks over capacity", r.over + " of " + D.weeks, "weeks above " + state.capacity + " h") +
      metric("Top client's share of revenue", (r.topShare / 10).toFixed(1) + "%", cname(r.top)) +
      metric("Billable share of hours", (r.billShare / 10).toFixed(1) + "%", r.turned + " requests turned away");
    els.chart.innerHTML = weekChart(r, state.capacity);
  }

  function buildUI() {
    rootEl.innerHTML = "";
    var panel = document.createElement("div"); panel.className = "mb-presets"; els.rungs = [];
    var notes = ["Every hour sold by the hour: the anchor client plus small requests.", "Adds fixed-price projects: a set fee for a set scope, four weeks each.", "Adds a fixed package sold off the shelf, after eight weeks of building it.", "Adds three monthly retainers, won in weeks 5, 14 and 30.", "Cuts admin hours by 40% for a 20-hour set-up in week 1."];
    RUNGS.forEach(function (g, i) {
      var l = document.createElement("label"); l.className = "mb-preset";
      l.innerHTML = '<input type="radio" name="sl-rung" value="' + g.id + '"><span class="mb-pname">' + g.id + " · " + esc(g.label) + '</span><span class="mb-pnote">' + esc(notes[i]) + "</span>";
      l.querySelector("input").addEventListener("change", function () { state.rung = g.id; render(); });
      panel.appendChild(l); els.rungs.push(l);
    });
    rootEl.appendChild(panel);
    var toggles = document.createElement("div"); toggles.className = "mb-presets";
    function tog(id, name, note, key) {
      var l = document.createElement("label"); l.className = "mb-preset is-anti";
      l.innerHTML = '<input type="checkbox" id="' + id + '"><span class="mb-pname">' + esc(name) + '</span><span class="mb-pnote">' + esc(note) + "</span>";
      l.querySelector("input").addEventListener("change", function (e) { state[key] = e.target.checked; render(); });
      toggles.appendChild(l); return l;
    }
    els.anti = tog("sl-anti", "Say yes to every hourly client (anti-lever)", "Takes every hourly request whatever the week holds, plus discount requests normally turned away.", "anti");
    els.brk = tog("sl-brk", "Lose the biggest client in week 27 (break)", "The client with the most revenue sends nothing from week 27. Prints the hole and the runway.", "brk");
    rootEl.appendChild(toggles);
    var row = document.createElement("div"); row.className = "ab-caprow";
    row.innerHTML = '<label for="sl-cap">Weekly capacity</label><input type="range" id="sl-cap" min="30" max="60" step="1" value="' + state.capacity + '"><output id="sl-capout"></output>' +
      '<label for="sl-price">Hourly price</label><input type="range" id="sl-price" min="60" max="200" step="5" value="' + state.price + '"><output id="sl-priceout"></output>';
    rootEl.appendChild(row);
    els.capOut = row.querySelector("#sl-capout"); els.priceOut = row.querySelector("#sl-priceout");
    row.querySelector("#sl-cap").addEventListener("input", function (e) { state.capacity = +e.target.value; render(); });
    row.querySelector("#sl-price").addEventListener("input", function (e) { state.price = +e.target.value; render(); });
    els.verdict = document.createElement("p"); rootEl.appendChild(els.verdict);
    els.metrics = document.createElement("div"); els.metrics.className = "mb-metrics"; rootEl.appendChild(els.metrics);
    var card = document.createElement("div"); card.className = "ab-card";
    card.innerHTML = '<h4>52 weeks of Marlow <span class="mb-mkind is-heuristic">modelled</span></h4>';
    els.chart = document.createElement("div"); els.chart.className = "sl-stage"; card.appendChild(els.chart);
    rootEl.appendChild(card);
    var hint = document.createElement("p"); hint.className = "mb-hint";
    hint.textContent = "Modelled, not measured: Marlow is constructed, and demand is a seeded draw (seed " + D.seed + "), the same for every rung. Illustrative, not financial or tax advice. " +
      "Defaults: hourly $110, projects $5,400 for 4 weeks of 9 h, productized $1,800 for 7 h, retainers $700 a week for 5 h, admin 6 h a week plus 0.5 h per client billed, weekly costs $2,000, $8,000 cash at the start. " +
      "Effective rate divides revenue by every hour worked, including sales, admin and building. The Python reference in the repository reproduces every default number to the cent.";
    rootEl.appendChild(hint);
    render();
  }

  function init() {
    rootEl = document.getElementById("capacity-bench");
    if (!rootEl) return;
    buildUI();
    root.SOLO_LIVE = { set: function (rung, anti, brk) { state.rung = rung; state.anti = !!anti; state.brk = !!brk;
      var a = document.getElementById("sl-anti"), b = document.getElementById("sl-brk"); if (a) a.checked = state.anti; if (b) b.checked = state.brk; render(); },
      state: state, run: function (rung, anti, brk) { return run(params(), rung, anti, brk); } };
  }

  var api = { D: D, RUNGS: RUNGS, demand: demand, simulate: simulate, run: run, canon: canon, mulberry32: mulberry32 };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof document !== "undefined") {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
  }
})(typeof window !== "undefined" ? window : this);
