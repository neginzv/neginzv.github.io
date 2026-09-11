# Negin Zadehvakili — Portfolio

Static one-page portfolio site. No build step, no dependencies.

```
index.html      markup + all section placeholders
styles.css      design system (colors, type, layout)
script.js       mobile menu, scroll-spy nav, reveal-on-scroll
images/hero-new.jpg front image
```

## Preview locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

(Or just double-click `index.html`.)

## Filling in the text later

Every section's copy is stubbed out and hidden. To add content:

1. Find the block in `index.html` marked `<!-- TEXT PLACEHOLDER -->`.
2. Write the paragraphs inside it.
3. Delete `is-hidden` from that element's `class`.

Placeholders available: `home-lede`, `bio`, `statement`, `project`, `contact`.

Example:

```html
<div class="prose" data-placeholder="bio">
  <p>First paragraph…</p>
  <p>Second paragraph…</p>
</div>
```

### Projects

Projects are organised as nested panels, routed by URL hash:

```
#projects              index of all categories
  #photography
  #image-experiments   → #fractured-contact
  #performance         → #music-performance, #conceptual-performance
  #installation        → #ask-the-mirror
  #mixed-media
```

The sidebar mirrors this tree. A category with no work yet shows a
`<p class="empty">` note.

**Adding a work.** Copy an existing `panel--work` section in `index.html`,
give it a new `id`, and add a matching `<li>` under its category in the
sidebar `nav__sub`. The layout is: eyebrow (linking back to the category),
title, `work__place` (city — year), a `.prose` block, then a `.plates`
block of full-width `<figure class="plate">` images that stack and scroll.
Drop the images in `images/<work-slug>/` and set `width`/`height` on each
`<img>` so the page doesn't reflow as they load.

To list the work on its category page, add an `<li class="work">` to that
category's `<ul class="works">` grid.

### Contact

The Instagram row is live. A commented-out email row sits right below it —
uncomment and set the address.

## Changing the look

All colors, fonts, and spacing live in the `:root` block at the top of
`styles.css`. Swapping `--accent` alone re-tints the site.

## Deploying

Any static host works. For GitHub Pages: push to `main`, then
Settings → Pages → Source: `main` / root.
