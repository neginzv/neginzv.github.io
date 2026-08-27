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

  // close after tapping a nav link on small screens
  sidebar.addEventListener('click', function (e) {
    if (e.target.closest('a') && window.matchMedia('(max-width: 860px)').matches) setMenu(false);
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
      a.classList.toggle('is-active', a.getAttribute('href') === '#' + id);
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
