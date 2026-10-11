/* ==========================================================================
   The Griff — booking data layer

   The booking screens (js/booking.js) only ever talk to this API object.
   Two implementations share the same methods:

     DemoApi    sample tee times generated in the browser (current)
     RemoteApi  talks to a small proxy service that holds the booking
                provider's API keys and forwards requests to their servers

   To go live: deploy the proxy (see README, "Booking: connecting the real
   system"), then set  GriffBooking.config.mode = "live"  and the endpoint.

   Every method returns a Promise. Shapes:

     getRules() -> { memberDaysAhead, visitorDaysAhead, memberOpensAt,
                     minPlayers, maxPlayers, holdMinutes, lastTeeMinutes }
     signIn(household, password) -> { household, name, category }
         category: "adult" | "young-adult" | "senior" | "junior"
     searchTeeTimes({ date, players, holes, member }) ->
         [{ id, time: "07:10", label: "7:10 a.m.", open, twilight,
            allowed, reason, price: { perPlayer, rateName } }]
     holdTeeTime({ id, date, players, holes }) -> { holdId, minutes }
     confirmBooking({ holdId, golfer, carts, payAt }) -> { confirmation }
   ========================================================================== */
(function () {
  "use strict";

  var G = (window.GriffBooking = window.GriffBooking || {});

  G.config = G.config || {
    mode: "demo",               // "demo" | "live"
    endpoint: "/api/booking"    // proxy base URL when mode is "live"
  };

  /* ------------------------------------------------------------ helpers */
  // "Today" is always today in Greenwich, wherever the visitor is.
  G.todayInGreenwich = function () {
    try {
      var p = {};
      new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
        .formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
      return { iso: p.year + "-" + p.month + "-" + p.day, minutes: parseInt(p.hour, 10) * 60 + parseInt(p.minute, 10) };
    } catch (e) {
      var d = new Date();
      return { iso: d.toISOString().slice(0, 10), minutes: d.getHours() * 60 + d.getMinutes() };
    }
  };
  G.addDays = function (iso, n) {
    var d = new Date(iso + "T12:00:00Z");
    d.setUTCDate(d.getUTCDate() + n);
    return d.toISOString().slice(0, 10);
  };
  G.weekday = function (iso) { return new Date(iso + "T12:00:00Z").getUTCDay(); }; // 0 = Sunday
  G.isWeekend = function (iso) { var w = G.weekday(iso); return w === 0 || w === 6; };
  G.timeLabel = function (mins) {
    var h = Math.floor(mins / 60), m = mins % 60, ap = h < 12 ? "a.m." : "p.m.";
    var h12 = h % 12 === 0 ? 12 : h % 12;
    return h12 + ":" + (m < 10 ? "0" : "") + m + " " + ap;
  };

  /* -------------------------------------------------------------- demo */
  // Published 2026 greens fees. Where the course's rules aren't published
  // (what counts as "peak", when twilight starts, member 9-hole rates) the
  // demo uses clearly-marked SAMPLE assumptions; the real system decides.
  var MEMBER_18 = {
    "adult":       { weekday: 38, weekend: 44, name: "Adult member" },
    "young-adult": { weekday: 38, weekend: 44, name: "Young Adult member" },
    "senior":      { weekday: 28, weekend: 44, name: "Senior member" },
    "junior":      { weekday: 27, weekend: 44, name: "Junior member" }
  };
  var SAMPLE_TWILIGHT_FROM = 15 * 60;   // SAMPLE: 3:00 p.m.
  var DEMO_HOUSEHOLDS = {
    "1001": { password: "demo", name: "Pat Rivera", category: "adult" },
    "2002": { password: "demo", name: "Lou Bianchi", category: "senior" }
  };

  function hash(str) { var h = 2166136261; for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function wait(v) { return new Promise(function (r) { setTimeout(function () { r(v); }, 350); }); }
  function fail(msg) { return new Promise(function (_, rej) { setTimeout(function () { rej(new Error(msg)); }, 350); }); }

  function DemoApi() { this.holds = {}; }

  DemoApi.prototype.getRules = function () {
    return wait({ memberDaysAhead: 5, visitorDaysAhead: 3, memberOpensAt: "6:00 a.m.", minPlayers: 2, maxPlayers: 4, holdMinutes: 10, lastTeeMinutes: 18 * 60 + 30 });
  };

  DemoApi.prototype.signIn = function (household, password) {
    var h = DEMO_HOUSEHOLDS[String(household).trim()];
    if (!h || h.password !== String(password)) return fail("We couldn't find that household number and password. Please check them, or call the ticket office at (203) 531-6944.");
    return wait({ household: String(household).trim(), name: h.name, category: h.category });
  };

  DemoApi.prototype.searchTeeTimes = function (q) {
    var weekend = G.isWeekend(q.date);
    var first = weekend ? 6 * 60 + 30 : 7 * 60;      // published typical hours
    var last = 18 * 60 + 30;
    var now = G.todayInGreenwich();
    var out = [];
    for (var t = first; t <= last; t += 10) {
      if (q.date === now.iso && t <= now.minutes + 15) continue;     // already gone
      var r = hash(q.date + "|" + t) % 100;
      var booked = r < 38 ? 4 : r < 55 ? 2 + (r % 2) : r < 70 ? 1 : 0;  // SAMPLE availability
      var open = 4 - booked;
      if (open < q.players) continue;
      var twilight = t >= SAMPLE_TWILIGHT_FROM;
      var allowed = true, reason = "";
      if (q.holes === 9 && weekend && t < 12 * 60) { allowed = false; reason = "Nine-hole rounds start after noon on weekends and holidays."; }
      out.push({ id: q.date + "T" + t, time: t, label: G.timeLabel(t), open: open, twilight: twilight, allowed: allowed, reason: reason, price: price(q, weekend, twilight) });
    }
    return wait(out);
  };

  function price(q, weekend, twilight) {
    if (q.member) {
      if (q.holes === 9) return { perPlayer: null, rateName: "Member 9-hole rate, confirmed at check-in" };
      if (twilight) return { perPlayer: 27, rateName: "Member twilight" };
      var m = MEMBER_18[q.member.category] || MEMBER_18.adult;
      return { perPlayer: weekend ? m.weekend : m.weekday, rateName: m.name + (weekend ? ", weekend" : ", weekday") };
    }
    if (twilight) return { perPlayer: 39, rateName: "Visitor twilight" };
    if (q.holes === 9) return { perPlayer: 57, rateName: "Visitor, 9 holes" };
    return weekend ? { perPlayer: 68, rateName: "Visitor, peak (sample: weekends)" } : { perPlayer: 65, rateName: "Visitor, off-peak (sample: weekdays)" };
  }

  DemoApi.prototype.holdTeeTime = function (q) {
    var id = "H" + (hash(q.id + Date.now()) % 100000);
    this.holds[id] = q;
    return wait({ holdId: id, minutes: 10 });
  };

  DemoApi.prototype.confirmBooking = function (b) {
    if (!this.holds[b.holdId]) return fail("That tee time is no longer held. Please choose a time again.");
    delete this.holds[b.holdId];
    return wait({ confirmation: "DEMO-" + String(hash(b.holdId + b.golfer.name) % 1000000).padStart(6, "0") });
  };

  /* ------------------------------------------------------------ remote */
  // Talks to the proxy. The proxy translates these calls to the provider's
  // API, keeps keys secret, and returns the shapes documented above.
  function RemoteApi(base) { this.base = base.replace(/\/$/, ""); }
  RemoteApi.prototype._req = function (path, opts) {
    return fetch(this.base + path, Object.assign({ credentials: "include", headers: { "Content-Type": "application/json" } }, opts || {}))
      .then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (body) {
          if (!r.ok) throw new Error(body.message || "The booking system isn't responding. Please call the starter at (203) 531-8253.");
          return body;
        });
      });
  };
  RemoteApi.prototype.getRules = function () { return this._req("/rules"); };
  RemoteApi.prototype.signIn = function (household, password) { return this._req("/session", { method: "POST", body: JSON.stringify({ household: household, password: password }) }); };
  RemoteApi.prototype.searchTeeTimes = function (q) {
    var qs = "?date=" + encodeURIComponent(q.date) + "&players=" + q.players + "&holes=" + q.holes;
    return this._req("/tee-times" + qs);
  };
  RemoteApi.prototype.holdTeeTime = function (q) { return this._req("/holds", { method: "POST", body: JSON.stringify(q) }); };
  RemoteApi.prototype.confirmBooking = function (b) { return this._req("/bookings", { method: "POST", body: JSON.stringify(b) }); };

  G.createApi = function () {
    return G.config.mode === "live" ? new RemoteApi(G.config.endpoint) : new DemoApi();
  };
})();
