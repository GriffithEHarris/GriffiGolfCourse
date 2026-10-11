(function () {
  "use strict";

  var root = document.documentElement;

  // ------------------------------------------------------------------
  // Saved visitor preferences (text size & contrast).
  // The <head> of every page applies these before the page paints;
  // here we wire up the buttons and keep their pressed state in sync.
  // ------------------------------------------------------------------
  function save(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* private mode etc. */ }
  }

  function setTextSize(size) {
    if (size === "normal") root.removeAttribute("data-text");
    else root.setAttribute("data-text", size);
    save("griff-text", size);
    document.querySelectorAll("[data-text-size]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-text-size") === size));
    });
  }

  function setContrast(high) {
    if (high) root.setAttribute("data-contrast", "high");
    else root.removeAttribute("data-contrast");
    save("griff-contrast", high ? "high" : "normal");
    document.querySelectorAll("[data-contrast-toggle]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(high));
    });
  }

  document.querySelectorAll("[data-text-size]").forEach(function (btn) {
    btn.addEventListener("click", function () { setTextSize(btn.getAttribute("data-text-size")); });
  });
  document.querySelectorAll("[data-contrast-toggle]").forEach(function (btn) {
    btn.addEventListener("click", function () { setContrast(root.getAttribute("data-contrast") !== "high"); });
  });

  setTextSize(root.getAttribute("data-text") || "normal");
  setContrast(root.getAttribute("data-contrast") === "high");

  // ------------------------------------------------------------------
  // Menu button (phones & tablets)
  // ------------------------------------------------------------------
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    var label = toggle.querySelector(".menu-label");
    var setOpen = function (open) {
      document.body.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      if (label) label.textContent = open ? "Close" : "Menu";
    };
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") !== "true";
      setOpen(open);
      if (open) {
        var first = nav.querySelector("a");
        if (first) first.focus();
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.body.classList.contains("nav-open")) {
        setOpen(false);
        toggle.focus();
      }
    });
    window.matchMedia("(min-width: 961px)").addEventListener("change", function (mq) {
      if (mq.matches) setOpen(false);
    });
  }

  // ------------------------------------------------------------------
  // Print buttons (rate cards, membership fees)
  // ------------------------------------------------------------------
  // data-print="rates carts" prints just those sections, under a small
  // letterhead, instead of the whole page.
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

  // ------------------------------------------------------------------
  // Footer year
  // ------------------------------------------------------------------
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
