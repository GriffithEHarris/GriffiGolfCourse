(function () {
  "use strict";
  var root = document.documentElement;
  root.classList.add("js");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) root.classList.add("no-motion");
  function save(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function pressAll(sel, fn) { document.querySelectorAll(sel).forEach(function (b) { b.setAttribute("aria-pressed", String(fn(b))); }); }

  /* ---- Text size & contrast (shared with V.1) ---- */
  function setText(size) {
    if (size === "normal") root.removeAttribute("data-text"); else root.setAttribute("data-text", size);
    save("griff-text", size);
    pressAll("[data-text-size]", function (b) { return b.getAttribute("data-text-size") === size; });
  }
  function setContrast(on) {
    if (on) root.setAttribute("data-contrast", "high"); else root.removeAttribute("data-contrast");
    save("griff-contrast", on ? "high" : "normal");
    pressAll("[data-contrast-toggle]", function () { return on; });
  }
  document.querySelectorAll("[data-text-size]").forEach(function (b) { b.addEventListener("click", function () { setText(b.getAttribute("data-text-size")); }); });
  document.querySelectorAll("[data-contrast-toggle]").forEach(function (b) { b.addEventListener("click", function () { setContrast(root.getAttribute("data-contrast") !== "high"); }); });
  setText(root.getAttribute("data-text") || "normal");
  setContrast(root.getAttribute("data-contrast") === "high");

  /* ---- Pause motion: stops CSS animation and the SVG flag & ball ---- */
  var svgs = document.querySelectorAll(".land svg");
  function setMotion(paused) {
    if (paused) root.setAttribute("data-motion", "paused"); else root.removeAttribute("data-motion");
    save("griff-motion", paused ? "paused" : "playing");
    pressAll("[data-motion-toggle]", function () { return paused; });
    svgs.forEach(function (s) {
      if (!s.pauseAnimations) return;
      if (paused) { if (s.getCurrentTime() < 3.4) s.setCurrentTime(3.4); s.pauseAnimations(); }
      else s.unpauseAnimations();
    });
    document.querySelectorAll("[data-motion-toggle]").forEach(function (b) { b.textContent = paused ? "Play motion" : "Pause motion"; });
  }
  document.querySelectorAll("[data-motion-toggle]").forEach(function (b) { b.addEventListener("click", function () { setMotion(root.getAttribute("data-motion") !== "paused"); }); });
  setMotion(reduce || root.getAttribute("data-motion") === "paused");

  /* ---- The sky follows the time of day in Greenwich ---- */
  var parts = { dawn: "Good morning", day: "Good day", dusk: "Good evening", night: "Good evening" };
  function greenwichNow() {
    var now = new Date();
    try {
      var f = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", hour: "numeric", minute: "2-digit", hour12: true, weekday: "short", month: "short", day: "numeric" });
      var p = {}; f.formatToParts(now).forEach(function (x) { p[x.type] = x.value; });
      var h24 = parseInt(new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", hour: "numeric", hourCycle: "h23" }).format(now), 10);
      return { h: h24, time: p.hour + ":" + p.minute + " " + (p.dayPeriod || "").toLowerCase().replace("am", "a.m.").replace("pm", "p.m."), date: p.weekday + " " + p.month + " " + p.day };
    } catch (e) { return { h: now.getHours(), time: "", date: "" }; }
  }
  function partFor(h) { return h >= 5 && h < 8 ? "dawn" : h >= 8 && h < 17 ? "day" : h >= 17 && h < 20 ? "dusk" : "night"; }
  function setSky(part) {
    root.setAttribute("data-daypart", part);
    pressAll("[data-sky]", function (b) { return b.getAttribute("data-sky") === part; });
  }
  var g = greenwichNow();
  var forced = (location.search.match(/[?&]sky=(dawn|day|dusk|night)/) || [])[1];
  setSky(forced || partFor(g.h));
  var hello = g.h < 12 ? "Good morning" : g.h < 17 ? "Good afternoon" : "Good evening";
  var greet = document.querySelector("#greeting span:last-child");
  if (greet && g.time) greet.textContent = hello + ", Greenwich. It’s " + g.time + " on King Street.";
  var bd = document.getElementById("board-date");
  if (bd && g.date) bd.textContent = g.date;
  document.querySelectorAll("[data-sky]").forEach(function (b) { b.addEventListener("click", function () { setSky(b.getAttribute("data-sky")); }); });

  /* ---- Menu button ---- */
  var mb = document.querySelector(".menu-btn");
  if (mb) {
    var setOpen = function (o) { document.body.classList.toggle("nav-open", o); mb.setAttribute("aria-expanded", String(o)); mb.querySelector(".menu-label").textContent = o ? "Close" : "Menu"; };
    mb.addEventListener("click", function () { var o = mb.getAttribute("aria-expanded") !== "true"; setOpen(o); if (o) document.querySelector("#site-nav a").focus(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && document.body.classList.contains("nav-open")) { setOpen(false); mb.focus(); } });
  }

  /* ---- Scroll-in effects, counters, leaderboard flip, pace track ---- */
  function countUp(el) {
    var to = parseInt(el.getAttribute("data-count"), 10), from = parseInt(el.getAttribute("data-from") || "0", 10);
    if (root.getAttribute("data-motion") === "paused" || reduce) return;
    var start = null, dur = 1600;
    function fmt(n) { return to >= 10000 || to === 6512 ? n.toLocaleString("en-US") : String(n); }
    function step(t) { if (!start) start = t; var k = Math.min(1, (t - start) / dur); k = 1 - Math.pow(1 - k, 3);
      el.textContent = fmt(Math.round(from + (to - from) * k)); if (k < 1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }
  var watched = document.querySelectorAll(".rise, .board, .pace, .stats");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        if (e.target.classList.contains("stats")) e.target.querySelectorAll("[data-count]").forEach(countUp);
        io.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -12% 0px" });
    watched.forEach(function (el) { io.observe(el); });
  } else { watched.forEach(function (el) { el.classList.add("in"); }); }

  /* ---- Print buttons: data-print="rates carts" prints only those sections ---- */
  document.querySelectorAll("[data-print]").forEach(function (btn) {
    btn.hidden = false;
    btn.addEventListener("click", function () {
      var ids = (btn.getAttribute("data-print") || "").split(/\s+/).filter(Boolean);
      var targets = ids.map(function (id) { return document.getElementById(id); }).filter(Boolean);
      if (targets.length) {
        document.body.classList.add("print-selection");
        targets.forEach(function (el) { el.classList.add("print-target"); });
      }
      window.print();
    });
  });
  window.addEventListener("afterprint", function () {
    document.body.classList.remove("print-selection");
    document.querySelectorAll(".print-target").forEach(function (el) { el.classList.remove("print-target"); });
  });

  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
