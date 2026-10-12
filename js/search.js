/* Site search. The index (js/search-index.js) is built with the pages and
   lists every section's heading and text; this ranks sections against the
   words typed and shows the best matches with the words highlighted. */
(function () {
  "use strict";
  var form = document.querySelector("[data-search-form]");
  if (!form) return;
  var input = form.querySelector("[data-search-input]");
  var status = document.querySelector("[data-search-status]");
  var list = document.querySelector("[data-search-results]");
  var quick = document.querySelector("[data-search-quick]");

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; });
  }
  function norm(s) { return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[’‘]/g, "'"); }
  /* Plain-English synonyms, so "price" finds rates and "kids" finds juniors. */
  var SAME = { price: "fee", prices: "fee", cost: "fee", rate: "fee", rates: "fee", kids: "junior", children: "junior", child: "junior",
    raincheck: "rain", phone: "call", food: "restaurant", eat: "restaurant", dinner: "restaurant", buggy: "cart",
    womens: "women", ladies: "women", group: "outing", tournament: "outing", charity: "outing" };

  function words(q) {
    return norm(q).split(/[^a-z0-9$']+/).filter(function (w) { return w.length > 1 || /\d/.test(w); });
  }
  function stem(w) { return w.replace(/'s$/, "").replace(/(ies)$/, "y").replace(/(es|s)$/, ""); }

  function score(entry, terms) {
    var h = norm(entry.h), t = norm(entry.t), p = norm(entry.page);
    var total = 0;
    for (var i = 0; i < terms.length; i++) {
      var w = terms[i], alt = SAME[w] || w, found = 0;
      [w, stem(w), alt, stem(alt)].forEach(function (x) {
        if (!x || found) return;
        if (h.indexOf(x) !== -1) found = 6;
        else if (p.indexOf(x) !== -1) found = 3;
        else if (t.indexOf(x) !== -1) found = 2 + Math.min(2, t.split(x).length - 2) * 0.5;
      });
      if (!found) return 0; /* every word must match somewhere */
      total += found;
    }
    return total;
  }

  function snippet(text, terms) {
    var low = norm(text), at = -1;
    for (var i = 0; i < terms.length && at === -1; i++) at = low.indexOf(stem(terms[i]));
    var start = Math.max(0, at - 70);
    var cut = text.slice(start, start + 220);
    if (start > 0) cut = "…" + cut.replace(/^\S*\s/, "");
    if (start + 220 < text.length) cut = cut.replace(/\s\S*$/, "") + "…";
    var out = esc(cut);
    terms.map(stem).filter(function (w) { return w.length > 1; }).forEach(function (w) {
      out = out.replace(new RegExp("(" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "[a-z]*)", "gi"), "<mark>$1</mark>");
    });
    return out;
  }

  function run(q) {
    var terms = words(q);
    list.innerHTML = "";
    if (!terms.length) {
      status.textContent = "";
      quick.hidden = false;
      return;
    }
    var hits = (window.GRIFF_SEARCH || [])
      .map(function (e) { return { e: e, s: score(e, terms) }; })
      .filter(function (r) { return r.s > 0; })
      .sort(function (a, b) { return b.s - a.s; })
      .slice(0, 12);
    quick.hidden = hits.length > 0;
    status.textContent = hits.length
      ? (hits.length === 1 ? "1 result" : hits.length + " results") + " for “" + q.trim() + "”."
      : "No results for “" + q.trim() + "”. Try a different word, or pick a page below.";
    list.innerHTML = hits.map(function (r) {
      return '<li><a href="' + esc(r.e.url) + '"><span class="r-page">' + esc(r.e.page) + "</span>" +
        "<b>" + esc(r.e.h) + "</b><span class=\"r-text\">" + snippet(r.e.t, terms) + "</span></a></li>";
    }).join("");
  }

  var q = new URLSearchParams(location.search).get("q") || "";
  input.value = q;
  run(q);
  var timer;
  input.addEventListener("input", function () {
    clearTimeout(timer);
    timer = setTimeout(function () { run(input.value); }, 150);
  });
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var url = new URL(location.href);
    url.searchParams.set("q", input.value);
    history.replaceState(null, "", url);
    run(input.value);
  });
  if (!q) input.focus();
})();
