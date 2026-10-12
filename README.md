# The Griff — Griffith E. Harris Golf Course

A modernized website for the Town of Greenwich's public golf course, **The Griff**, at 1323 King Street, Greenwich, CT. It replaces the current site at thegriffgolf.org.

This is a plain static site: HTML, one stylesheet and one script. It has no build step and no dependencies, so it can be hosted anywhere (GitHub Pages, Netlify, the Town's web server or an S3 bucket).

## Versions

| Version | Where | Look |
| --- | --- | --- |
| **V2 (current)** | Site root (`index.html` and so on) | Lively and distinctive: a living sky, tournament leaderboard, scorecards and arches |
| V.1 | `v1/` folder, and the `V.1` branch | Classic and elegant: Playfair Display, ivory and gold, printed-menu rate cards |

Both versions share the illustrations in `assets/`, and the text-size and contrast settings visitors choose carry over between them.

## Design approach (V2)

**Shapes from the game, not generic rounded boxes**
- **Living hero sky.** It follows the time of day in Greenwich: dawn, day, dusk, or night with stars and the moon.
  - Clouds drift and the flag waves. On the home page, a ball flies along a dotted line into the cup.
  - The home page greets visitors with the local time: "Good morning, Greenwich. It's 7:42 a.m. on King Street."
  - Visitors can change the sky with the **Sky** buttons. Add `?sky=dawn`, `day`, `dusk` or `night` to any page address to preview each one.
- **Tournament leaderboard.** White plates on a green board, used for course hours and the phone directory.
- **Arched clubhouse windows** for the three ways to play.
- **Printed scorecards** with perforated edges for greens fees and tee yardages, and **ticket stubs** for carts and range buckets.
- **A rotating seal** for the membership price and the 36 walk-up spots.
- **Golf-ball shapes:** numbered golf balls for step-by-step instructions, and a ball rolling along the pace-of-play track.
- **Pennant-flag cards**, tee-marker "On this page" links and wavy fairway-edge dividers between sections.
- **Type and colour:** Fraunces headings, Oswald for leaderboard and scorecard lettering, and tournament-flag yellow with course green.

**Local:** King Street throughout, a live Greenwich clock, "Owned by the Town of Greenwich", and plain-spoken copy.

**Easy to use for older visitors and everyone else**
- **Large, legible text.** The body font is Atkinson Hyperlegible (designed by the Braille Institute for low-vision readers) at 20px, with strong contrast.
- **Visitor controls on every page:** text size (A / A+ / A++), **High contrast** and **Pause motion**. Choices are remembered on that device. Devices set to reduce motion get a still page automatically.
- **Big targets.** Buttons are at least 56px tall, links are underlined, and the menu button says "Menu" in words.
- **The phone is never far away.** Every number is tap-to-call, and on phones a "Call Starter / Book Tee Time" bar stays fixed at the bottom of the screen.
- **Nothing hidden.** Content never depends on animation, so with JavaScript off or motion paused, everything is still visible.
- **No sideways scrolling or cut-off content.** Tested at 320, 390 and 768px, at normal and largest text. Tables restack on small phones.
- **Printing.** "Print" buttons print only the rate cards or membership fees, under a letterhead with the course phone number: one page for membership fees, two for greens fees with carts and range.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home: living-sky hero, course-facts ticker, three ways to play, the course, scorecards, membership seal, clubhouse, Pro Shop and clubs, FAQ |
| `course.html` | History, tee scorecard, practice areas, hours board, course rules, pace of play |
| `tee-times.html` | Ways to book, step-by-step online booking, walk-ups, 2026 greens fees, carts and range, good to know |
| `membership.html` | Benefits, 2026 membership fees, who can join, how to apply, juniors |
| `clubhouse.html` | Restaurant and bar, Pro Shop with online lesson booking, men's and women's clubs, handicaps |
| `news.html` | News & Events: the season's tournaments and closings, course news posts, email sign-up |
| `outings.html` | Host an outing: the shotgun package, what's included, how to book |
| `policies.html` | Cancellations and no-shows, rain checks, frost delays, forms and documents |
| `search.html` | Site search (uses `js/search-index.js`, rebuilt with the pages) |
| `contact.html` | Phone directory board, staff directory, email and Instagram, address, hours, directions and map |
| `accessibility.html` | Text size, contrast, pausing motion, phone help and printing |
| `404.html` | "Lost ball" page for links that don't exist, with routes back to the main pages |
| `book.html` | Preview of online tee-time booking with sample data. Not in the menus yet; see "Online booking (preview)" |

Shared files:

- `css/griff.css`: the design system. Colours, fonts and the time-of-day sky colours are CSS variables at the top of the file.
- `js/griff.js`: text size, contrast and motion controls; the sky and greeting; the menu button; scroll-in effects and counters; and the print buttons.
- `assets/`: the logo (`favicon.svg`) and illustrations (`landscape.svg`, `hole.svg`, `tee.svg`, `flag.svg`, `patio.svg`).
- `snippets/`: parked page sections that are not on the site right now (see below).

## Launching

### Stage 1: staging preview (current)

Every push to the `claude/tender-hawking-28smna` branch publishes the site to GitHub Pages through `.github/workflows/pages.yml`:

**https://paulanthony-alt.github.io/GriffithEHarris/**

- **One-time setup** (repository admin): **Settings → Pages → Build and deployment → Source: GitHub Actions**. Then re-run the "Deploy site to GitHub Pages" workflow from the **Actions** tab.
- **Hidden from search engines.** The staging copy marks every page `noindex`, so search engines won't list it as the course's website.
- **What gets published:** the main pages, `404.html`, `css/`, `js/`, `assets/` and the `v1/` archive. Nothing in `snippets/` or this README is published.

### Stage 2: going live on thegriffgolf.org (after the town signs off)

1. **Booking link.** Replace `RESERVE_URL` (the old site's `227/Reserve-a-Tee-Time` page, which disappears when the domain moves) with the booking system's direct address.
2. **Content.** Clear the "Content to verify before launch" list below.
3. **Turn off staging mode.** In `.github/workflows/pages.yml`, delete the "Mark as staging (noindex)" step.
4. **Domain.** Add a `CNAME` file containing `thegriffgolf.org` (or `www.thegriffgolf.org`), and copy it into `_site` in the "Assemble" step. Set the same custom domain under Settings → Pages.
5. **Town IT.** Point the domain's DNS at GitHub Pages: `A` records for the apex domain, or a `CNAME` record for `www` pointing to `paulanthony-alt.github.io`.
6. **Old links.** Ask how long CivicPlus will keep the old site up. Visitors' bookmarks to old pages such as `/153/Fee-Schedule` will land on the "Lost ball" 404 page, which points them to the right place. If the town wants exact redirects, list the most-visited old URLs and add them.

## Online booking (preview)

`book.html` is a working preview of a modern tee-time booking flow in the site's style. It runs on **sample tee times**, takes no payment and books nothing. It is not linked from the menus, and every step says so. Demo member sign-in: household **1001** or **2002**, password **demo**.

**The flow:** four steps, one decision at a time, with a running "Your round" scorecard and the starter's phone number at every step.
1. **Visitor or member** (member sign-in), number of golfers (2–4), 9 or 18 holes, and the day.
   - Visitors see 3 days ahead; signed-in members see 5.
   - After the last tee time, the page starts on tomorrow.
2. **Tee times** as tickets, showing open places and the price per golfer, filterable by morning, midday or afternoon.
   - Nine-hole rounds before noon on weekends are shown as unavailable, with the reason.
3. **Contact details, carts and payment:** pay at the course, or pay online through the booking company's secure card form. In the preview that form is only a labelled placeholder; there are no card fields.
4. **Confirmation**, with "Add to my calendar" (an `.ics` file), print, and a reminder to call the starter for changes.

**Files**
- `js/booking-api.js`: the data layer. `DemoApi` makes the sample data. `RemoteApi` calls the real system through a proxy. The method shapes are documented at the top of the file.
- `js/booking.js`: the screens. They only ever talk to the API object.
- `css/booking.css`: the booking styles.

**Sample assumptions** (the real system replaces these): "peak" means weekends, twilight starts at 3:00 p.m., and members' 9-hole rate is shown as "confirmed at check-in". Fees are the published 2026 rates.

### Booking: connecting the real system

1. **Get API access** from the booking company through the town's account: API documentation, test ("sandbox") credentials, and agreement to their terms.
2. **Deploy a small proxy**, for example on Cloudflare Workers, Netlify Functions or the town's own servers. It keeps the API keys secret, translates requests into the company's API, and returns the shapes documented in `js/booking-api.js`:

   | Method | Path | Purpose |
   | --- | --- | --- |
   | `GET` | `/rules` | Booking windows, player limits and how long a hold lasts |
   | `POST` | `/session` | Member sign-in (household number and password are checked by the booking company) |
   | `GET` | `/tee-times?date=&players=&holes=` | Available times and prices |
   | `POST` | `/holds` | Hold a tee time while the golfer finishes |
   | `POST` | `/bookings` | Confirm the booking |

3. **Payments** use the booking company's own secure card form, built into step 3. Card numbers never pass through this site or the proxy.
4. **Switch it on:** set `GriffBooking.config = { mode: "live", endpoint: "https://…/api/booking" }`. Then remove the preview notice and stamp from `book.html`, point the site's "Book a Tee Time" buttons at `book.html`, and test end to end against the sandbox before going live.

## Previewing locally

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Day-to-day edits

### "Today at The Griff" leaderboard (parked)

The daily-conditions board (course open, carts, range) has been taken off the home page until someone can keep it updated every morning; a stale "OPEN" is worse than none. Its markup is saved in `snippets/today-at-the-griff.html`, with instructions at the top of that file for putting it back. Its styles and script are still in place, so restoring it is a single paste.

### Rates

- **Greens fees:** the scorecards and ticket stubs in `tee-times.html` (`#rates`, `#carts`).
- **Membership fees:** the list in `membership.html` (`#fees`) and the price in the seal.
- **Home page:** `index.html` repeats the scorecards, stubs and membership list. Update those too.

### Other edits

- **Online booking link:** "Reserve online" points to the current reservation page. Search the HTML files for `227/Reserve-a-Tee-Time` and replace it with the booking provider's direct link.
- **Header, navigation and footer** appear on every page. When you change one, update every page.
- **Course news:** add a post at the top of the "Course news" section in `news.html` (a date, a headline and a few short paragraphs). Keep closings and aeration dates current.
- **Search:** `js/search-index.js` lists the text of every page. Rebuild it whenever page text changes, or search results will show old wording.

## Swapping in real photography

The illustrations are placeholders that keep the site looking finished until photos arrive.

- **Arches, rounded frames and the clubhouse panel:** replace each `<img src="assets/…svg">` with a photo and give it an `alt` text that describes the photo.
- **The animated hero landscape:** this is drawn in code, so it stays as the site's signature.
- **Size:** about 1200px wide for photos, compressed to around 300 KB or less.

## Content to verify before launch

The live thegriffgolf.org could not be loaded directly while this was built, so the content comes from the site's indexed pages and public listings. Please confirm these items with course staff:

- [ ] **Tee yardages, ratings and slopes** (`course.html#tees`). Public sources disagree. The Blue tees are listed anywhere from 6,357 to 6,512 yards, and the site uses 6,512. The Green tee rating and slope are marked "W" because they appear to be women's ratings.
- [ ] **Hours** (`course.html#hours`, `contact.html`). These are from the 2021 opening notice.
- [ ] **"Today at The Griff" board** (parked in `snippets/`): decide whether someone will update it daily, or connect it to a data source, before bringing it back.
- [ ] **Online booking URL**, and whether online membership renewal is offered.
- [ ] **Cancellation, rain check and frost delay rules** (`policies.html`). They come from the old site's policy pages. The rain check for an 18-hole round stopped between holes 3 and 9 isn't stated anywhere, so the page tells golfers to ask the starter.
- [ ] **Outing package** (`outings.html`): $88 per player, 12:30–1:00 p.m. shotgun, 80-player minimum, and the outing director's direct line (the old site lists (203) 531-6176; the page uses the main office for now).
- [ ] **Staff directory** (`contact.html#staff`): names and roles come from the old site and the Pro Shop's site.
- [ ] **Email sign-up** (`news.html#signup`) points to the Town's "Notify Me" list on the old site. Give the new site its own sign-up before the domain moves.
- [ ] **Links that live on the old site** and will break when the domain moves: the membership application and advance reservation policy PDFs, the newsletter archive and the "Notify Me" sign-up. Copy the PDFs into this repository before launch.
- [ ] **Handicaps** (`clubhouse.html#handicap`): confirm whether town membership itself includes a GHIN number or only club membership.
- [ ] **Events** (`news.html#events`): this year's dates for the town tournament, Swing Fore Hope and aeration.
- [ ] **Phone directory** (`contact.html`), especially the Operations line.
- [ ] **Pro Shop and restaurant links:** griffgolfshop.com and the Clubhouse at the Griff Facebook page.
- [ ] **Men's club (GHMGC) contact** and the women's clubs' details (BWGA, Greenwich Women's Golf Club), plus any senior or junior leagues to list.
- [ ] **Pro Shop email and Instagram** (`info.griffgolfshop@gmail.com`, `@golfshopatthegriff`) and the Clubhouse Instagram (`@clubhouse_at_the_griff`).
- [ ] **Adult membership age range** (shown as 22–64, inferred from the Young Adult and Senior brackets).
