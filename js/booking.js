/* ==========================================================================
   The Griff — tee-time booking screens (book.html)
   Talks only to GriffBooking.createApi() — see js/booking-api.js.
   ========================================================================== */
(function () {
  "use strict";
  var G = window.GriffBooking;
  if (!G || !document.getElementById("booking")) return;
  var api = G.createApi();

  var STARTER = "(203) 531-8253";
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  var state = {
    rules: null, member: null, players: 2, holes: 18, date: null, filter: "all",
    times: [], selected: null, hold: null, carts: "walk", payAt: "course"
  };

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function money(n) { return "$" + n; }
  function longDate(iso) {
    var d = new Date(iso + "T12:00:00Z");
    return DAYS[d.getUTCDay()] + ", " + MONTHS[d.getUTCMonth()].replace("Sep", "Sept") + " " + d.getUTCDate();
  }
  function setText(el, txt) { if (el) el.textContent = txt; }
  function esc(v) { return String(v).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  /* ---------------------------------------------------------------- steps */
  function showStep(n) {
    $all(".bk-step").forEach(function (s) { s.hidden = s.id !== "step-" + n; });
    $all(".stepper li").forEach(function (li) {
      var k = parseInt(li.getAttribute("data-step"), 10);
      li.classList.toggle("done", k < n);
      if (k === n) li.setAttribute("aria-current", "step"); else li.removeAttribute("aria-current");
    });
    var h = $("#step-" + n + " h2");
    if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
    var top = $(".stepper").getBoundingClientRect().top + window.scrollY - 100;
    if (window.scrollY > top) window.scrollTo({ top: top, behavior: "smooth" });
    document.body.setAttribute("data-bk-step", n);
  }

  function showError(where, msg) {
    var box = $(where);
    if (!box) return;
    box.textContent = msg;
    box.hidden = !msg;
  }

  /* ------------------------------------------------------- step 1: round */
  function renderDays() {
    var wrap = $("#bk-days");
    var today = G.todayInGreenwich().iso;
    var memberMax = state.rules.memberDaysAhead, visitorMax = state.rules.visitorDaysAhead;
    var limit = state.member ? memberMax : visitorMax;
    wrap.innerHTML = "";
    for (var i = 0; i <= memberMax; i++) {
      var iso = G.addDays(today, i);
      var d = new Date(iso + "T12:00:00Z");
      var locked = i > limit;
      var id = "day-" + iso;
      var label = document.createElement("label");
      label.className = "bk-day" + (locked ? " locked" : "");
      label.setAttribute("for", id);
      label.innerHTML =
        '<input type="radio" name="bk-day" id="' + id + '" value="' + iso + '"' + (locked ? " disabled" : "") + ">" +
        '<span class="dow">' + (i === 0 ? "Today" : i === 1 ? "Tomorrow" : DAYS[d.getUTCDay()].slice(0, 3)) + "</span>" +
        '<span class="num">' + d.getUTCDate() + "</span>" +
        '<span class="mon">' + MONTHS[d.getUTCMonth()] + "</span>" +
        (locked ? '<span class="lock">Members only</span>' : "");
      wrap.appendChild(label);
    }
    // After the last tee time of the day, start on tomorrow instead of an empty "Today".
    var firstDay = G.todayInGreenwich().minutes > (state.rules.lastTeeMinutes || 1110) - 15 ? G.addDays(today, 1) : today;
    if (!state.date || state.date < firstDay || state.date > G.addDays(today, limit)) state.date = firstDay;
    var cur = $("#day-" + state.date);
    if (cur) cur.checked = true;
    $all('input[name="bk-day"]').forEach(function (r) {
      r.addEventListener("change", function () { state.date = r.value; summary(); });
    });
    setText($("#bk-day-note"), state.member
      ? "As a member you can book up to " + memberMax + " days ahead (from " + state.rules.memberOpensAt + ")."
      : "Visitors can book up to " + visitorMax + " days ahead. Members can book " + memberMax + " days ahead.");
  }

  function bindChoices() {
    $all('input[name="bk-who"]').forEach(function (r) {
      r.addEventListener("change", function () {
        var isMember = r.value === "member";
        $("#bk-signin").hidden = !isMember || !!state.member;
        if (!isMember) { state.member = null; $("#bk-member-ok").hidden = true; renderDays(); summary(); }
      });
    });
    $all('input[name="bk-players"]').forEach(function (r) {
      r.addEventListener("change", function () { state.players = parseInt(r.value, 10); summary(); });
    });
    $all('input[name="bk-holes"]').forEach(function (r) {
      r.addEventListener("change", function () { state.holes = parseInt(r.value, 10); summary(); });
    });

    $("#bk-signin-form").addEventListener("submit", function (e) {
      e.preventDefault();
      showError("#bk-signin-error", "");
      var btn = $("#bk-signin-btn"); btn.disabled = true; setText(btn.querySelector(".lbl"), "Checking…");
      api.signIn($("#bk-household").value, $("#bk-password").value).then(function (m) {
        state.member = m;
        $("#bk-signin").hidden = true;
        $("#bk-member-ok").hidden = false;
        setText($("#bk-member-name"), m.name);
        renderDays(); summary();
      }).catch(function (err) {
        showError("#bk-signin-error", err.message);
      }).then(function () { btn.disabled = false; setText(btn.querySelector(".lbl"), "Sign in"); });
    });
    $("#bk-signout").addEventListener("click", function () {
      state.member = null;
      $("#bk-member-ok").hidden = true;
      $("#bk-signin").hidden = false;
      renderDays(); summary();
    });

    $("#bk-search").addEventListener("click", function () {
      var who = $('input[name="bk-who"]:checked').value;
      if (who === "member" && !state.member) {
        showError("#bk-signin-error", "Please sign in with your household number and password, or choose “I’m a visitor”.");
        $("#bk-household").focus();
        return;
      }
      search();
    });
  }

  /* --------------------------------------------------- step 2: tee time */
  function search() {
    var res = $("#bk-results");
    res.setAttribute("aria-busy", "true");
    res.innerHTML = '<p class="bk-loading">Finding tee times…</p>';
    showStep(2);
    setText($("#bk-results-title"), longDate(state.date) + " · " + state.players + " golfers · " + state.holes + " holes");
    api.searchTeeTimes({ date: state.date, players: state.players, holes: state.holes, member: state.member })
      .then(function (times) { state.times = times; renderTimes(); })
      .catch(function (err) { res.innerHTML = ""; showError("#bk-results-error", err.message); })
      .then(function () { res.removeAttribute("aria-busy"); });
  }

  function inFilter(t) {
    if (state.filter === "morning") return t.time < 11 * 60;
    if (state.filter === "midday") return t.time >= 11 * 60 && t.time < 14 * 60;
    if (state.filter === "afternoon") return t.time >= 14 * 60;
    return true;
  }

  function renderTimes() {
    var res = $("#bk-results");
    var list = state.times.filter(inFilter);
    res.innerHTML = "";
    showError("#bk-results-error", "");
    if (!list.length) {
      res.innerHTML = '<div class="bk-empty"><p><strong>No tee times match.</strong> Try another part of the day, fewer golfers or another day. The starter can also check for you at <a href="tel:+12035318253">' + STARTER + "</a>.</p></div>";
      setText($("#bk-count"), "No tee times found");
      return;
    }
    setText($("#bk-count"), list.length + (list.length === 1 ? " tee time" : " tee times") + " available");
    var ul = document.createElement("ul");
    ul.className = "bk-times";
    list.forEach(function (t) {
      var li = document.createElement("li");
      var b = document.createElement("button");
      b.type = "button";
      b.className = "bk-time" + (t.twilight ? " twilight" : "") + (t.allowed ? "" : " blocked");
      b.disabled = !t.allowed;
      var dots = "";
      for (var i = 0; i < 4; i++) dots += '<span class="dot' + (i < t.open ? " open" : "") + '"></span>';
      var priceTxt = t.price.perPlayer == null ? "Rate at check-in" : esc(money(t.price.perPlayer)) + " <small>per golfer</small>";
      b.innerHTML =
        '<span class="t">' + esc(t.label) + "</span>" +
        '<span class="spots"><span class="dots" aria-hidden="true">' + dots + "</span>" + esc(t.open) + " of 4 open</span>" +
        '<span class="p">' + priceTxt + "</span>" +
        (t.twilight ? '<span class="tag">Twilight</span>' : "") +
        (t.allowed ? "" : '<span class="why">' + esc(t.reason) + "</span>");
      b.setAttribute("aria-label", t.label + ", " + t.open + " of 4 places open, " + (t.price.perPlayer == null ? "rate confirmed at check-in" : money(t.price.perPlayer) + " per golfer") + (t.allowed ? "" : ". Not available: " + t.reason));
      b.addEventListener("click", function () { choose(t, b); });
      li.appendChild(b);
      ul.appendChild(li);
    });
    res.appendChild(ul);
  }

  function choose(t, btn) {
    btn.disabled = true;
    setText(btn.querySelector(".t"), "Holding…");
    api.holdTeeTime({ id: t.id, date: state.date, players: state.players, holes: state.holes }).then(function (h) {
      state.selected = t; state.hold = h;
      setText($("#bk-hold-note"), "We’re holding " + t.label + " on " + longDate(state.date) + " for you for " + h.minutes + " minutes while you finish.");
      var nm = $("#bk-name");
      if (state.member && !nm.value) nm.value = state.member.name;
      summary();
      showStep(3);
    }).catch(function (err) {
      showError("#bk-results-error", err.message);
      btn.disabled = false; setText(btn.querySelector(".t"), t.label);
    });
  }

  /* ------------------------------------------- step 3: details & payment */
  function cartCost() {
    if (state.carts === "walk" || !state.selected) return 0;
    if (state.carts === "single") return state.players * 27;
    var each = state.selected.twilight ? 30 : state.holes === 18 ? 40 : 25;
    return Math.ceil(state.players / 2) * each;
  }

  function bindDetails() {
    $all('input[name="bk-carts"]').forEach(function (r) { r.addEventListener("change", function () { state.carts = r.value; summary(); }); });
    $all('input[name="bk-pay"]').forEach(function (r) {
      r.addEventListener("change", function () { state.payAt = r.value; $("#bk-card").hidden = r.value !== "online"; });
    });
    ["#bk-name", "#bk-phone"].forEach(function (sel) {
      $(sel).addEventListener("input", function () { $(sel).removeAttribute("aria-invalid"); showError("#bk-details-error", ""); });
    });
    ["#bk-household", "#bk-password"].forEach(function (sel) {
      $(sel).addEventListener("input", function () { showError("#bk-signin-error", ""); });
    });
    $("#bk-details").addEventListener("submit", function (e) {
      e.preventDefault();
      var name = $("#bk-name"), phone = $("#bk-phone");
      var problems = [];
      if (!name.value.trim()) problems.push("your name");
      if (phone.value.replace(/\D/g, "").length < 10) problems.push("a phone number with area code");
      [name, phone].forEach(function (f) { f.removeAttribute("aria-invalid"); });
      if (problems.length) {
        showError("#bk-details-error", "Please add " + problems.join(" and ") + " so the starter can reach you.");
        (name.value.trim() ? phone : name).setAttribute("aria-invalid", "true");
        (name.value.trim() ? phone : name).focus();
        return;
      }
      showError("#bk-details-error", "");
      var btn = $("#bk-book"); btn.disabled = true; setText(btn.querySelector(".lbl"), "Booking…");
      api.confirmBooking({
        holdId: state.hold.holdId,
        golfer: { name: name.value.trim(), phone: phone.value.trim(), email: $("#bk-email").value.trim(), household: state.member && state.member.household },
        carts: state.carts, payAt: state.payAt
      }).then(function (r) { confirmation(r, name.value.trim()); })
        .catch(function (err) { showError("#bk-details-error", err.message); })
        .then(function () { btn.disabled = false; setText(btn.querySelector(".lbl"), "Book this tee time"); });
    });
    $("#bk-back-2").addEventListener("click", function () { state.selected = null; state.hold = null; summary(); search(); });
    $("#bk-back-1").addEventListener("click", function () { showStep(1); });
    $all('input[name="bk-filter"]').forEach(function (r) { r.addEventListener("change", function () { state.filter = r.value; renderTimes(); }); });
  }

  /* -------------------------------------------------- step 4: confirmed */
  function confirmation(r, name) {
    var t = state.selected;
    setText($("#bk-conf-number"), r.confirmation);
    setText($("#bk-conf-name"), name);
    setText($("#bk-conf-when"), longDate(state.date) + " at " + t.label);
    setText($("#bk-conf-what"), state.players + " golfers, " + state.holes + " holes, " + ({ walk: "walking", two: "two-person carts", single: "single-rider carts" })[state.carts]);
    setText($("#bk-conf-pay"), state.payAt === "online" ? "Paid online" : "Pay at the ticket office when you arrive");
    var start = state.date.replace(/-/g, "") + "T" + String(Math.floor(t.time / 60)).padStart(2, "0") + String(t.time % 60).padStart(2, "0") + "00";
    var mins = state.holes === 18 ? 255 : 130;
    var endM = t.time + mins;
    var end = state.date.replace(/-/g, "") + "T" + String(Math.floor(endM / 60)).padStart(2, "0") + String(endM % 60).padStart(2, "0") + "00";
    var ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//The Griff//Tee time//EN", "BEGIN:VEVENT",
      "UID:" + r.confirmation + "@thegriffgolf.org",
      "DTSTAMP:" + new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z",
      "DTSTART;TZID=America/New_York:" + start, "DTEND;TZID=America/New_York:" + end,
      "SUMMARY:Tee time at The Griff (" + state.players + " golfers, " + state.holes + " holes)",
      "LOCATION:Griffith E. Harris Golf Course\\, 1323 King Street\\, Greenwich\\, CT 06831",
      "DESCRIPTION:Confirmation " + r.confirmation + ". Please check in at the ticket office before your tee time. Starter: " + STARTER + ".",
      "END:VEVENT", "END:VCALENDAR"
    ].join("\r\n");
    var a = $("#bk-ics");
    a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    a.download = "griff-tee-time-" + state.date + ".ics";
    showStep(4);
  }

  /* -------------------------------------------------------------- summary */
  function summary() {
    setText($("#sum-who"), state.member ? state.member.name + " (member)" : "Visitor");
    setText($("#sum-date"), state.date ? longDate(state.date) : "Choose a day");
    setText($("#sum-time"), state.selected ? state.selected.label : "Choose a time");
    setText($("#sum-players"), state.players + " golfers");
    setText($("#sum-holes"), state.holes + " holes");
    var t = state.selected;
    var rate = $("#sum-rate"), total = $("#sum-total"), carts = $("#sum-carts");
    if (!t) { setText(rate, "Shown with each time"); setText(carts, "Chosen next"); setText(total, "—"); return; }
    if (t.price.perPlayer == null) setText(rate, t.price.rateName);
    else {
      setText(rate, money(t.price.perPlayer) + " × " + state.players);
      var sm = document.createElement("small"); sm.textContent = t.price.rateName; rate.appendChild(sm);
    }
    var c = cartCost();
    setText(carts, state.carts === "walk" ? "Walking" : money(c));
    setText(total, t.price.perPlayer == null ? "Confirmed at check-in" : money(t.price.perPlayer * state.players + c));
  }

  /* ----------------------------------------------------------------- go */
  api.getRules().then(function (rules) {
    state.rules = rules;
    renderDays(); bindChoices(); bindDetails(); summary();
    $("#booking").classList.add("ready");
  });

  $all("[data-bk-restart]").forEach(function (b) {
    b.addEventListener("click", function () {
      state.selected = null; state.hold = null;
      $("#bk-details").reset(); state.carts = "walk"; state.payAt = "course"; $("#bk-card").hidden = true;
      summary(); showStep(1);
    });
  });
  $all("[data-bk-print]").forEach(function (b) { b.addEventListener("click", function () { window.print(); }); });
})();
