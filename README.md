# The Griff — Griffith E. Harris Golf Course

A modernized website for the Town of Greenwich's public golf course, **The Griff**, at 1323 King Street, Greenwich, CT. It replaces the current site at thegriffgolf.org.

This is a plain static site: HTML, one stylesheet and one small script. It has no build step and no dependencies, so it can be hosted anywhere (GitHub Pages, Netlify, the Town's web server or an S3 bucket).

## Design approach

**Elegant, like a classic golf club**
- Playfair Display serif headings
- Ivory and parchment backgrounds with deep course green
- Restrained gold detailing and hairline rules
- Rate cards set like a printed menu, with dotted leaders
- Painted-style illustrations

**Local**
- "Est. 1963 · Town of Greenwich" throughout
- A King Street welcome and a "Visit us" section
- Plain-spoken copy that reads like the town's own course, not a resort

**Easy to use for older visitors and everyone else**
- **Large, legible text.** The body font is Atkinson Hyperlegible, a typeface designed by the Braille Institute for low-vision readers, at 20px.
- **Visitor controls on every page:** text size (A / A+ / A++) and a high-contrast mode. The choice is remembered on that device.
- **Strong contrast.** Body text is above 9:1 and every text colour pair passes WCAG AA; most pass AAA.
- **Big targets.** Buttons are at least 56px tall, links are always underlined, and the menu button says "Menu" in words.
- **The phone is never far away.** Every number is tap-to-call. On phones, a "Call Starter / Book Tee Time" bar stays fixed at the bottom of the screen.
- **Nothing hidden or moving.** No carousels, tabs or scroll-in animations. The FAQ uses plain expandable questions that also work without JavaScript.
- **No sideways scrolling.** Tables turn into labelled rows on phones. Tested at 320, 360, 390 and 768px, at every text size.
- **Printing.** "Print" buttons on the rates and membership pages print just the price cards, under a letterhead with the course phone number.
- **Help on every page.** An accessibility page explains the controls, and each page ends with a "call us for help" strip.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home: hero, "Today at The Griff" conditions panel, welcome, course, tee times, membership, fees at a glance, three ways to book, clubhouse, FAQ, visit us |
| `course.html` | History, tees and yardage, practice areas, hours, course rules, pace of play |
| `tee-times.html` | Ways to book, step-by-step online booking, walk-ups, 2026 greens fees, carts and range, good to know |
| `membership.html` | Benefits, 2026 membership fees, who can join, how to apply, juniors |
| `clubhouse.html` | Restaurant and bar, Pro Shop, clubs and leagues |
| `contact.html` | Phone directory, address, hours, directions and map |
| `accessibility.html` | How to enlarge text, use high contrast, print rates and get help |

Shared files:

- `css/styles.css`: the design system. Colours, fonts, sizes and spacing are CSS variables at the top of the file.
- `js/main.js`: text size and contrast controls, the menu button, and the print buttons.
- `assets/`: the logo (`favicon.svg`) and illustrations (`landscape.svg`, `hole.svg`, `tee.svg`, `flag.svg`, `patio.svg`).

## Previewing locally

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Day-to-day edits

### "Today at The Griff" (home page)

Find the `TODAY AT THE GRIFF` comment in `index.html` and change the words: Open, Allowed, Closed, Frost delay and so on. The coloured dot is set by the class:

- `status`: green (open)
- `status status--delay`: amber
- `status status--closed`: red

> **This panel must be kept current, or removed if no one can update it daily.** Stale "Open" status is worse than none.

### Rates

- **Greens fees:** `tee-times.html` (`#rates`, `#carts`). Each line is one `<li>` inside a `.rates` list.
- **Membership fees:** `membership.html` (`#fees`).
- **Home page:** `index.html` repeats the 18-hole rates (`#rates`) and a few prices in the text. Update those too.

### Other edits

- **Online booking link:** "Reserve online" points to the current reservation page. Search the HTML files for `227/Reserve-a-Tee-Time` and replace it with the booking provider's direct link.
- **Header, navigation and footer** appear on every page. When you change one, update all seven files.

## Swapping in real photography

The illustrations are placeholders that keep the site looking finished until photos arrive.

- **Hero backgrounds:** change `url("../assets/landscape.svg")` in the `.hero, .page-hero` rule in `css/styles.css` to a photo, for example `url("../assets/hero.jpg")`. The dark overlay stays in place, so the text remains readable.
- **Feature images:** replace the `src` of each `<img>` (for example `assets/hole.svg`) and update its `alt` text to describe the photo.
- **Size:** about 2400px wide for the hero and 1200px for feature images, compressed to around 300 KB or less.

## Content to verify before launch

The live thegriffgolf.org could not be loaded directly while this was built, so the content comes from the site's indexed pages and public listings. Please confirm these items with course staff:

- [ ] **Tee yardages, ratings and slopes** (`course.html#tees`). Public sources disagree. The Blue tees are listed anywhere from 6,357 to 6,512 yards, and the home page uses 6,512. The Green tee rating and slope are marked "(W)" because they appear to be women's ratings.
- [ ] **Hours** (`course.html#hours`, `contact.html`). These are from the 2021 opening notice.
- [ ] **"Today at The Griff" values**, and who will update them each day.
- [ ] **Online booking URL**, and whether online membership renewal is offered.
- [ ] **Cancellation and same-day policies.** The wording is general because the official details weren't available.
- [ ] **Phone directory** (`contact.html`), especially the Operations Manager line.
- [ ] **Pro Shop and restaurant links:** griffgolfshop.com and the Clubhouse at the Griff Facebook page.
- [ ] **GHMGC contact**, plus any women's, senior or junior leagues to list.
- [ ] **Adult membership age range** (shown as 22–64, inferred from the Young Adult and Senior brackets).
