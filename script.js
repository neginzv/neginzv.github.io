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

  show(current());
})();
