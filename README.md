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

### Project grid

`index.html` has a commented-out `<ul class="works">` block inside the Project
section. Uncomment it, drop images into `assets/`, and duplicate the `<li>` per
project — the grid, hover zoom, and responsive columns are already styled.

### Contact

The Instagram row is live. A commented-out email row sits right below it —
uncomment and set the address.

## Changing the look

All colors, fonts, and spacing live in the `:root` block at the top of
`styles.css`. Swapping `--accent` alone re-tints the site.

## Deploying

Any static host works. For GitHub Pages: push to `main`, then
Settings → Pages → Source: `main` / root.
