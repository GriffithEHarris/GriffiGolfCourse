# The Griff — Griffith E. Harris Golf Course

A modernized website for the Town of Greenwich's municipal golf course, **The Griff**, at 1323 King Street, Greenwich, CT. It replaces the current site at thegriffgolf.org.

This is a plain static site: HTML, one stylesheet and one small script. It has no build step and no dependencies, so it can be hosted anywhere (GitHub Pages, Netlify, the Town's web server or an S3 bucket).

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home page: hero, course stats, quick links, booking windows, fee highlights, clubhouse and membership calls to action |
| `course.html` | Course history, tees and yardage, practice facilities, hours, rules and etiquette, pace of play |
| `tee-times.html` | How to reserve, walk-up and same-day play, 2026 greens fees (member and non-member tabs), carts, driving range |
| `membership.html` | Benefits, 2026 membership fees, eligibility and proof of residency, how to apply or renew, juniors |
| `clubhouse.html` | Pro Shop, Clubhouse restaurant and bar, clubs and leagues (GHMGC) |
| `contact.html` | Phone directory, address, directions and an embedded map |

Shared files:

- `css/styles.css`: the whole design system. Colors, fonts, spacing and radii are defined as CSS variables at the top of the file.
- `js/main.js`: mobile menu, rate tabs, section highlighting, scroll reveal and the footer year. Every page works without JavaScript.
- `assets/favicon.svg`: the logo mark.

## Previewing locally

Open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Common edits

- **Announcement bar:** each page has an `alert-bar` block near the top of `<body>`. Update the text on every page, for example for closures, frost delays or season opening.
- **Rates:** edit the tables in `tee-times.html` (`#rates`, `#carts`, `#range`) and `membership.html` (`#fees`). The fee highlights on `index.html` repeat some of these numbers, so update those as well.
- **Online booking link:** "Reserve online" in `tee-times.html` points to the current reservation page (`RESERVE_URL`). Replace it with the booking provider's direct link.
- **Header, navigation and footer** appear on every page. When you change one, update all six files.

## Content to verify before launch

The live thegriffgolf.org could not be loaded directly while this was built, so the content comes from the site's indexed pages and public listings. Please confirm these items with course staff:

- [ ] **Tee yardages, ratings and slopes** (`course.html#tees`). Public sources disagree. The Blue tees are listed anywhere from 6,357 to 6,512 yards. The Green tee rating and slope are marked "(W)" because they appear to be women's ratings.
- [ ] **Hours** (`course.html#hours`). These are from the 2021 opening notice: weekdays 7:00 a.m.–7:30 p.m., weekends 6:30 a.m.–7:30 p.m.
- [ ] **Online booking URL** (see above) and whether online membership renewal is offered.
- [ ] **Same-day reservation and cancellation policies.** The wording is general because the official details weren't available.
- [ ] **Phone directory** (`contact.html`), especially the Operations and Assistant Operations Manager lines.
- [ ] **Pro Shop and restaurant links:** griffgolfshop.com and the Clubhouse at the Griff Facebook page.
- [ ] **GHMGC contact email** (`clubhouse.html#clubs`), plus any women's, senior or junior leagues to list.
- [ ] **Adult membership age range** (shown as 22–64, inferred from the Young Adult and Senior brackets).

## Photography

The hero and course art are lightweight SVG illustrations, so the site looks finished before photos arrive. To use real photos:

- **Home hero:** replace the `<svg>` inside `.hero-art` in `index.html` with `<img src="assets/hero.jpg" alt="" style="width:100%;height:100%;object-fit:cover">`.
- **Course panels:** replace the `<svg>` inside any `.art-panel` the same way.

Use images about 2400px wide, compressed to around 300 KB or less.

## Accessibility

- Semantic landmarks, a skip link, a breadcrumb and a visible focus style.
- Keyboard-operable mobile menu (Esc closes it) and rate tabs (arrow keys switch them).
- Phone numbers are tap-to-call links.
- Respects `prefers-reduced-motion`.
- Responsive from 320px phones to large desktops.
- Includes a print stylesheet.
