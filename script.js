/* Negin Zadehvakili — portfolio interactions */

(function () {
  'use strict';

  /* ── Year ─────────────────────────────────────────────── */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ── Mobile menu ──────────────────────────────────────── */
  var sidebar = document.getElementById('sidebar');
  var toggle  = document.querySelector('.menu-toggle');
  var scrim   = document.querySelector('.scrim');

  function setMenu(open) {
    sidebar.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    scrim.hidden = !open;
    // let the element paint before transitioning opacity
    requestAnimationFrame(function () { scrim.classList.toggle('is-on', open); });
  }

  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });

  scrim.addEventListener('click', function () { setMenu(false); });

  // close after tapping a nav link on small screens — but not when the tap
  // only unfolds a section, or the list it just revealed would slide away
  sidebar.addEventListener('click', function (e) {
    var link = e.target.closest('a');
    if (!link || !window.matchMedia('(max-width: 860px)').matches) return;

    var li = link.closest('li');
    var unfolds = li && li.querySelector(':scope > .nav__sub') &&
                  !li.classList.contains('is-expanded');

    if (!unfolds) setMenu(false);
  });

  /* ── Panel router ─────────────────────────────────────── */
  var panels = Array.prototype.slice.call(document.querySelectorAll('[data-panel]'));
  var links  = Array.prototype.slice.call(document.querySelectorAll('[data-nav]'));

  function show(id) {
    if (!document.getElementById(id)) id = 'home';
    if (box && box.open) box.close();       // Back while a photograph is up

    panels.forEach(function (p) {
      var on = p.id === id;
      if (p.id === 'home') return;          // the hero always sits underneath
      if (on) {
        p.hidden = false;
        requestAnimationFrame(function () { p.classList.add('is-open'); });
      } else {
        p.classList.remove('is-open');
        p.hidden = true;
      }
    });

    document.body.classList.toggle('panel-open', id !== 'home');

    links.forEach(function (a) {
      a.classList.remove('is-active', 'is-trail');
    });

    // Sub-lists stay folded away; only the branch you are standing in opens.
    Array.prototype.forEach.call(document.querySelectorAll('.nav li'), function (li) {
      li.classList.remove('is-expanded');
    });

    var active = links.filter(function (a) {
      return a.getAttribute('href') === '#' + id;
    })[0];

    if (active) {
      active.classList.add('is-active');

      // open the section you just clicked, plus every section above it
      var li = active.closest('li');
      if (li && li.querySelector(':scope > .nav__sub')) li.classList.add('is-expanded');

      while (li) {
        li = li.parentElement.closest('li');
        if (!li) break;
        li.classList.add('is-expanded');
        var parent = li.querySelector(':scope > a[data-nav]');
        if (parent) parent.classList.add('is-trail');
      }

      if (active.scrollIntoView) {
        active.scrollIntoView({ block: 'nearest' });
      }
    }

    links.forEach(function (a) {
      var li = a.closest('li');
      if (li && li.querySelector(':scope > .nav__sub')) {
        a.setAttribute('aria-expanded', String(li.classList.contains('is-expanded')));
      }
    });

    var open = document.getElementById(id);
    if (open) {
      var scroller = open.querySelector('.panel__scroll');
      if (scroller) scroller.scrollTop = 0;
    }
  }

  function current() {
    return (location.hash || '#home').slice(1);
  }

  window.addEventListener('hashchange', function () { show(current()); });

  document.querySelectorAll('.panel__close').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (location.hash && location.hash !== '#home') location.hash = '#home';
      else show('home');
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (box && box.open) return;            // the dialog closes itself; leave the panel be
    if (sidebar.classList.contains('is-open')) { setMenu(false); return; }
    if (document.body.classList.contains('panel-open')) location.hash = '#home';
  });

  /* ── Image galleries ──────────────────────────────────────
     The markup ships as a plain horizontal strip, so swiping and
     trackpad scrolling work on their own. What is added here is
     only what needs a pointer: the arrows that fade in over the
     photograph, and the dashes that say how far along you are. */

  var SVG_NS = 'http://www.w3.org/2000/svg';

  function chevron(d) {
    var svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', '16');
    svg.setAttribute('height', '16');
    svg.setAttribute('aria-hidden', 'true');
    var path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', d);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'currentColor');
    path.setAttribute('stroke-width', '1.6');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(path);
    return svg;
  }

  function buildGallery(root) {
    var viewport = root.querySelector('.gallery__viewport');
    if (!viewport) return;
    var frame = viewport.parentElement;            // the arrows centre on this

    var slides = Array.prototype.slice.call(viewport.children);
    if (slides.length < 2) return;                 // one photograph needs no controls

    var smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var index  = 0;

    function arrow(dir, label, d) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'gallery__arrow gallery__arrow--' + dir;
      b.setAttribute('aria-label', label);
      b.appendChild(chevron(d));
      b.addEventListener('click', function () {
        go(index + (dir === 'next' ? 1 : -1));
      });
      frame.appendChild(b);
      return b;
    }

    var prev = arrow('prev', 'Previous image', 'M15 5l-7 7 7 7');
    var next = arrow('next', 'Next image',     'M9 5l7 7-7 7');

    var dots = document.createElement('ul');
    dots.className = 'gallery__dots';
    var marks = slides.map(function (_, i) {
      var li = document.createElement('li');
      var b  = document.createElement('button');
      b.type = 'button';
      b.className = 'gallery__dot';
      b.setAttribute('aria-label', 'Image ' + (i + 1) + ' of ' + slides.length);
      b.addEventListener('click', function () { go(i); });
      li.appendChild(b);
      dots.appendChild(li);
      return b;
    });
    root.appendChild(dots);

    function go(i) {
      i = Math.max(0, Math.min(slides.length - 1, i));
      viewport.scrollTo({
        left: slides[i].offsetLeft - slides[0].offsetLeft,
        behavior: smooth ? 'smooth' : 'auto'
      });
    }

    function sync() {
      var width = viewport.clientWidth;
      // A closed panel is display:none, so there is nothing to measure —
      // keep the index we had and just repaint the controls from it.
      if (width) {
        index = Math.max(0, Math.min(slides.length - 1,
                  Math.round(viewport.scrollLeft / width)));
      }

      prev.disabled = index === 0;
      next.disabled = index === slides.length - 1;

      marks.forEach(function (b, i) {
        if (i === index) b.setAttribute('aria-current', 'true');
        else             b.removeAttribute('aria-current');
      });
    }

    var queued = false;
    viewport.addEventListener('scroll', function () {
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () { queued = false; sync(); });
    }, { passive: true });

    window.addEventListener('resize', sync);

    // The panel this sits in opens by going from display:none to visible,
    // which fires no scroll or resize event — but it does change the
    // viewport's box, and that is what brings the controls back in step.
    if (window.ResizeObserver) new ResizeObserver(sync).observe(viewport);

    sync();
  }

  document.querySelectorAll('[data-gallery]').forEach(buildGallery);

  /* ── Contact sheets (photography series) ──────────────────
     The CSS alone already hangs the photographs in justified rows,
     but it breaks a row wherever the next print stops fitting, which
     can leave a tall row over a short one, or one photograph alone at
     the end. Here the breaks are chosen across the whole series at
     once: every row as close as it can get to the height the
     stylesheet asks for (--row), never much smaller, and the last row
     hung at the height of the row above it instead of blown up. */

  function rowHeight(sheet) {
    var probe = document.createElement('div');
    probe.style.cssText = 'position:absolute;visibility:hidden;width:0;height:var(--row)';
    sheet.appendChild(probe);
    var h = probe.offsetHeight;
    sheet.removeChild(probe);
    return h;
  }

  function layoutSheet(sheet) {
    var shots = Array.prototype.slice.call(sheet.querySelectorAll('.shot'));
    var width = sheet.clientWidth - 1;           // a hair of slack against rounding
    if (!width || !shots.length) return;         // closed panel: nothing to measure

    var gap    = parseFloat(getComputedStyle(sheet).columnGap) || 0;
    var target = rowHeight(sheet);
    var ratios = shots.map(function (li) {
      var img = li.querySelector('img');
      var w = +img.getAttribute('width'), h = +img.getAttribute('height');
      return w && h ? w / h : parseFloat(li.style.getPropertyValue('--r')) || 1;
    });

    function fit(from, to) {                     // height that fills the width exactly
      var sum = 0;
      for (var k = from; k < to; k++) sum += ratios[k];
      return { sum: sum, h: (width - gap * (to - from - 1)) / sum };
    }

    // every photograph on the row pays for the row's miss, so packing
    // many prints into one small row never looks cheaper than giving
    // them rows of their own; shrinking hurts more than growing
    function cost(h, count) {
      var d = h - target;
      return count * (d < 0 ? 3 * d * d : d * d);
    }

    var n = shots.length, best = [0], cut = [0];
    for (var i = 1; i <= n; i++) {
      best[i] = Infinity;
      for (var j = 0; j < i; j++) {
        var row = fit(j, i), c;
        if (i === n && row.h > target) {
          // a short last row stays near the target and leaves space
          // rather than stretching; charge it for the space it leaves
          var used = (row.sum * target + gap * (i - j - 1)) / width;
          c = 0.5 * Math.pow((1 - used) * target, 2);
        } else {
          c = cost(row.h, i - j);
        }
        if (best[j] + c < best[i]) { best[i] = best[j] + c; cut[i] = j; }
      }
    }

    var rows = [];
    for (var end = n; end > 0; end = cut[end]) rows.unshift([cut[end], end]);

    var prev = target;
    rows.forEach(function (r, ri) {
      var h = fit(r[0], r[1]).h;
      if (ri === rows.length - 1) h = Math.min(h, Math.max(target, prev));
      for (var k = r[0]; k < r[1]; k++) {
        shots[k].style.flex = '0 0 ' + (ratios[k] * h).toFixed(2) + 'px';
      }
      prev = h;
    });
  }

  var sheets = Array.prototype.slice.call(document.querySelectorAll('.shots'));
  sheets.forEach(function (sheet) {
    layoutSheet(sheet);
    // also fires when the panel opens from display:none
    if (window.ResizeObserver) new ResizeObserver(function () { layoutSheet(sheet); }).observe(sheet);
  });
  // a height-only resize changes --row without changing the sheet's width
  window.addEventListener('resize', function () { sheets.forEach(layoutSheet); });

  /* ── Lightbox (photography series) ────────────────────────
     Each thumbnail is a plain link to the full-size file, so
     without JS a click still opens the photograph. With it, the
     series opens in one shared <dialog>: arrows and ←/→ step
     through, Esc or a click on the dark ground closes, and a
     horizontal swipe turns the page on a phone. */

  var box, boxImg, boxCaption, boxCount, boxPrev, boxNext;
  var items = [], at = 0, opener = null;

  function lightboxButton(cls, label, d) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'lightbox__btn ' + cls;
    b.setAttribute('aria-label', label);
    var svg = chevron(d);
    svg.setAttribute('width', '20');
    svg.setAttribute('height', '20');
    b.appendChild(svg);
    return b;
  }

  function buildLightbox() {
    box = document.createElement('dialog');
    box.className = 'lightbox';
    box.setAttribute('aria-label', 'Photograph');

    var stage = document.createElement('div');
    stage.className = 'lightbox__stage';
    boxImg = document.createElement('img');
    boxImg.className = 'lightbox__img';
    boxImg.alt = '';
    stage.appendChild(boxImg);

    var bar = document.createElement('div');
    bar.className = 'lightbox__bar';
    boxCaption = document.createElement('p');
    boxCaption.className = 'lightbox__caption';
    boxCount = document.createElement('p');
    boxCount.className = 'lightbox__count';
    bar.appendChild(boxCaption);
    bar.appendChild(boxCount);

    var close = lightboxButton('lightbox__close', 'Close', 'M6 6l12 12M18 6L6 18');
    boxPrev   = lightboxButton('lightbox__prev', 'Previous photograph', 'M15 5l-7 7 7 7');
    boxNext   = lightboxButton('lightbox__next', 'Next photograph',     'M9 5l7 7-7 7');

    close.addEventListener('click', function () { box.close(); });
    boxPrev.addEventListener('click', function () { step(-1); });
    boxNext.addEventListener('click', function () { step(1); });

    // the ground around the photograph is the close target
    stage.addEventListener('click', function (e) {
      if (e.target === stage) box.close();
    });

    boxImg.addEventListener('load', function () { boxImg.classList.remove('is-loading'); });

    var startX = null, startY = 0;
    stage.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse') return;
      startX = e.clientX; startY = e.clientY;
    });
    stage.addEventListener('pointerup', function (e) {
      if (startX === null) return;
      var dx = e.clientX - startX, dy = e.clientY - startY;
      startX = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
    });
    stage.addEventListener('pointercancel', function () { startX = null; });

    box.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); step(-1); }
    });

    box.addEventListener('close', function () {
      boxImg.removeAttribute('src');
      if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
    });

    box.appendChild(stage);
    box.appendChild(bar);
    box.appendChild(boxPrev);
    box.appendChild(boxNext);
    box.appendChild(close);
    document.body.appendChild(box);
  }

  function render() {
    var item = items[at];
    if (boxImg.getAttribute('src') !== item.href) {
      boxImg.classList.add('is-loading');
      boxImg.src = item.href;
    }
    boxImg.alt = item.alt;
    boxCaption.textContent = item.caption;
    boxCount.textContent = (at + 1) + ' / ' + items.length;
    boxPrev.disabled = at === 0;
    boxNext.disabled = at === items.length - 1;

    // warm the neighbours so stepping through does not wait on the network
    [at - 1, at + 1].forEach(function (i) {
      if (items[i]) new Image().src = items[i].href;
    });
  }

  function step(d) {
    var i = at + d;
    if (i < 0 || i >= items.length) return;
    at = i;
    render();
  }

  function openLightbox(sheet, link) {
    if (!box) buildLightbox();
    var series = sheet.getAttribute('data-lightbox');
    var links = Array.prototype.slice.call(sheet.querySelectorAll('.shot__link'));

    items = links.map(function (a) {
      var img = a.querySelector('img');
      var cap = a.parentElement.querySelector('.shot__caption');
      return {
        href: a.getAttribute('href'),
        alt: img ? img.alt : '',
        caption: cap ? series + ' — ' + cap.textContent : series
      };
    });
    at = links.indexOf(link);
    opener = link;

    render();
    box.showModal();
  }

  document.querySelectorAll('[data-lightbox]').forEach(function (sheet) {
    sheet.addEventListener('click', function (e) {
      var link = e.target.closest('.shot__link');
      if (!link || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      openLightbox(sheet, link);
    });
  });

  show(current());
})();
