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

  show(current());
})();
