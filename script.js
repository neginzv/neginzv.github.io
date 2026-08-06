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
    toggle.setAttribute('aria-expanded', String(open));
    scrim.hidden = !open;
    // let the element paint before transitioning opacity
    requestAnimationFrame(function () { scrim.classList.toggle('is-on', open); });
    document.body.style.overflow = open ? 'hidden' : '';
  }

  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });

  scrim.addEventListener('click', function () { setMenu(false); });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && sidebar.classList.contains('is-open')) setMenu(false);
  });

  // close after tapping a nav link on small screens
  sidebar.addEventListener('click', function (e) {
    if (e.target.closest('a') && window.matchMedia('(max-width: 860px)').matches) setMenu(false);
  });

  /* ── Scroll spy ───────────────────────────────────────── */
  var links    = Array.prototype.slice.call(document.querySelectorAll('[data-nav]'));
  var sections = Array.prototype.slice.call(document.querySelectorAll('[data-section]'));

  function activate(id) {
    links.forEach(function (a) {
      a.classList.toggle('is-active', a.getAttribute('href') === '#' + id);
    });
  }

  if ('IntersectionObserver' in window) {
    var visible = new Map();

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
      });

      var best = null, bestRatio = 0;
      visible.forEach(function (ratio, id) {
        if (ratio > bestRatio) { bestRatio = ratio; best = id; }
      });
      if (best) activate(best);
    }, { threshold: [0, .15, .35, .6, 1], rootMargin: '-15% 0px -35% 0px' });

    sections.forEach(function (s) { spy.observe(s); });

    /* ── Reveal on scroll ───────────────────────────────── */
    var targets = document.querySelectorAll('.section__head, .section__body, .hero__text > *');
    var reveal = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        entry.target.style.transitionDelay = (i * 70) + 'ms';
        entry.target.classList.add('is-in');
        obs.unobserve(entry.target);
      });
    }, { threshold: .12, rootMargin: '0px 0px -8% 0px' });

    targets.forEach(function (el) {
      el.setAttribute('data-reveal', '');
      reveal.observe(el);
    });
  } else {
    activate('home');
  }
})();
