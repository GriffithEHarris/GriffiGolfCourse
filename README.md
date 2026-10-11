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
- **Tournament leaderboard.** White plates on a green board, used for "Today at The Griff", course hours and the phone directory.
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
| `index.html` | Home: living-sky hero, course-facts ticker, Today leaderboard, three ways to play, the course, scorecards, membership seal, clubhouse, Pro Shop and clubs, FAQ |
| `course.html` | History, tee scorecard, practice areas, hours board, course rules, pace of play |
| `tee-times.html` | Ways to book, step-by-step online booking, walk-ups, 2026 greens fees, carts and range, good to know |
| `membership.html` | Benefits, 2026 membership fees, who can join, how to apply, juniors |
| `clubhouse.html` | Restaurant and bar, Pro Shop, clubs and leagues |
| `contact.html` | Phone directory board, address, hours, directions and map |
| `accessibility.html` | Text size, contrast, pausing motion, phone help and printing |

Shared files:

- `css/griff.css`: the design system. Colours, fonts and the time-of-day sky colours are CSS variables at the top of the file.
- `js/griff.js`: text size, contrast and motion controls; the sky and greeting; the menu button; scroll-in effects and counters; and the print buttons.
- `assets/`: the logo (`favicon.svg`) and illustrations (`landscape.svg`, `hole.svg`, `tee.svg`, `flag.svg`, `patio.svg`).

## Previewing locally

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Day-to-day edits

### "Today at The Griff" leaderboard (home page)

Find the `EDIT DAILY` comment in `index.html` and change the plate text, for example OPEN, CLOSED, FROST DELAY or CART PATHS ONLY. A plate with the class `ok` shows in green; remove `ok` to show it in red. The date in the board's title fills in automatically.

> **Keep this board current, or remove it if no one can update it daily.** A stale "OPEN" is worse than none.

### Rates

- **Greens fees:** the scorecards and ticket stubs in `tee-times.html` (`#rates`, `#carts`).
- **Membership fees:** the list in `membership.html` (`#fees`) and the price in the seal.
- **Home page:** `index.html` repeats the scorecards, stubs and membership list. Update those too.

### Other edits

- **Online booking link:** "Reserve online" points to the current reservation page. Search the HTML files for `227/Reserve-a-Tee-Time` and replace it with the booking provider's direct link.
- **Header, navigation and footer** appear on every page. When you change one, update all seven files.

## Swapping in real photography

The illustrations are placeholders that keep the site looking finished until photos arrive.

- **Arches, rounded frames and the clubhouse panel:** replace each `<img src="assets/…svg">` with a photo and give it an `alt` text that describes the photo.
- **The animated hero landscape:** this is drawn in code, so it stays as the site's signature.
- **Size:** about 1200px wide for photos, compressed to around 300 KB or less.

## Content to verify before launch

The live thegriffgolf.org could not be loaded directly while this was built, so the content comes from the site's indexed pages and public listings. Please confirm these items with course staff:

- [ ] **Tee yardages, ratings and slopes** (`course.html#tees`). Public sources disagree. The Blue tees are listed anywhere from 6,357 to 6,512 yards, and the site uses 6,512. The Green tee rating and slope are marked "W" because they appear to be women's ratings.
- [ ] **Hours** (`course.html#hours`, `contact.html`). These are from the 2021 opening notice.
- [ ] **"Today at The Griff" values**, and who will update them each day.
- [ ] **Online booking URL**, and whether online membership renewal is offered.
- [ ] **Cancellation and same-day policies.** The wording is general because the official details weren't available.
- [ ] **Phone directory** (`contact.html`), especially the Operations line.
- [ ] **Pro Shop and restaurant links:** griffgolfshop.com and the Clubhouse at the Griff Facebook page.
- [ ] **Men's club (GHMGC) contact**, plus any women's, senior or junior leagues to list.
- [ ] **Adult membership age range** (shown as 22–64, inferred from the Young Adult and Senior brackets).
