/* ─── Bulochka Animations ─────────────────────────────────────────────────── */

(function () {
  'use strict';

  /* ── FULLSCREEN HERO — entrance + parallax ───────────────────────────── */
  (function initFhero() {
    var fhero = document.querySelector('.fhero');
    if (!fhero) return;

    // Entrance
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        fhero.classList.add('fhero--ready');
      });
    });

    // Parallax на фоне
    var bgImg = document.getElementById('fheroBgImg');
    if (!bgImg) return;
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var scrollY = window.scrollY;
        var h = fhero.offsetHeight;
        if (scrollY < h) {
          var offset = scrollY * 0.35;
          bgImg.style.transform = 'scale(1.08) translateY(' + offset + 'px)';
        }
        ticking = false;
      });
    }, { passive: true });
  })();

  /* ── 6. NAV — backdrop-blur + тень при скролле ────────────────────────── */
  (function initNavScroll() {
    var nav = document.querySelector('.nav');
    if (!nav) return;
    var scrolled = false;
    function onScroll() {
      var now = window.scrollY > 20;
      if (now === scrolled) return;
      scrolled = now;
      nav.classList.toggle('nav--scrolled', scrolled);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  })();

  /* ── 7. RIPPLE EFFECT на кнопках ─────────────────────────────────────── */
  (function initRipple() {
    var selectors = [
      'a.hero-menu-btn',
      '.btn-reserve',
      '.btn-pill',
      '.lang-btn',
      '.shop-card-btn',
      '.fhero-btn-primary',
      '.fhero-btn-secondary',
    ];
    selectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        el.style.position = 'relative';
        el.style.overflow = 'hidden';
        el.addEventListener('click', function (e) {
          var rect = el.getBoundingClientRect();
          var x = e.clientX - rect.left;
          var y = e.clientY - rect.top;
          var ripple = document.createElement('span');
          ripple.className = 'ripple-effect';
          ripple.style.left = x + 'px';
          ripple.style.top = y + 'px';
          el.appendChild(ripple);
          setTimeout(function () { ripple.remove(); }, 700);
        });
      });
    });
  })();

  /* ── 7. MAGNETIC HOVER на главных кнопках ────────────────────────────── */
  (function initMagnetic() {
    document.querySelectorAll('a.hero-menu-btn, .btn-reserve, .fhero-btn-primary, .fhero-btn-secondary').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        var dx = (e.clientX - cx) * 0.22;
        var dy = (e.clientY - cy) * 0.22;
        el.style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        el.style.transform = '';
        setTimeout(function () { el.style.transition = ''; }, 400);
      });
    });
  })();

  /* ── 2. SCROLL REVEAL — IntersectionObserver + translateY ───────────── */
  (function initScrollReveal() {
    var selectors = [
      '.room-header',
      '.medovik-text',
      '.medovik-photo',
      '.medovik-stat-val',
      '.medovik-stat-key',
      '.medovik-pricing',
      '.visit-text h2',
      '.visit-directions',
      '.visit-detail-group',
      '.visit-hours-row',
      '.section-eyebrow',
      '.shop-header',
      '.footer-brand',
      '.footer-top > div',
    ];

    var seen = new WeakSet();
    var all = [];
    selectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        if (seen.has(el)) return;
        seen.add(el);
        el.classList.add('sr-hidden');
        all.push(el);
      });
    });

    // stagger для visit-hours-row
    document.querySelectorAll('.visit-hours-row').forEach(function (el, i) {
      el.style.transitionDelay = (i * 0.08) + 's';
    });
    // stagger для footer columns
    document.querySelectorAll('.footer-top > div').forEach(function (el, i) {
      el.style.transitionDelay = (i * 0.08) + 's';
    });
    // stagger для medovik stats
    document.querySelectorAll('.medovik-stat-val, .medovik-stat-key').forEach(function (el, i) {
      el.style.transitionDelay = (i * 0.07) + 's';
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('sr-visible');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

    all.forEach(function (el) { io.observe(el); });
  })();

  /* ── 3. ROOM GRID STAGGER — фото появляются в шахматном порядке ─────── */
  (function initRoomStagger() {
    var photos = document.querySelectorAll('.room-photo');
    if (!photos.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('room-photo--visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    photos.forEach(function (el) { io.observe(el); });
  })();

  /* ── 4. MEDOVIK COUNTERS — цифры считаются вверх с easeOutExpo ──────── */
  (function initCounters() {
    var stats = document.querySelectorAll('.medovik-stat-val');
    if (!stats.length) return;

    function animateCount(el, target, duration) {
      var start = null;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / duration, 1);
        var eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
        el.textContent = Math.round(target * eased);
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var lang = document.documentElement.lang;
        var raw = (lang === 'he' ? el.getAttribute('data-he') : lang === 'ru' ? el.getAttribute('data-ru') : el.getAttribute('data-en')) || el.textContent;
        var num = parseInt(raw, 10);
        if (!isNaN(num)) animateCount(el, num, 1000);
        io.unobserve(el);
      });
    }, { threshold: 0.6 });

    stats.forEach(function (el) { io.observe(el); });
  })();

  /* ── 9. MEDOVIK PHOTO PARALLAX ±30px ────────────────────────────────── */
  (function initMedovikParallax() {
    var img = document.querySelector('.medovik-photo img');
    var section = document.querySelector('.medovik-section');
    if (!img || !section) return;
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var rect = section.getBoundingClientRect();
        var viewH = window.innerHeight;
        if (rect.bottom > 0 && rect.top < viewH) {
          var progress = (viewH - rect.top) / (viewH + rect.height);
          var offset = (progress - 0.5) * 60;
          img.style.transform = 'translateY(' + offset + 'px)';
        }
        ticking = false;
      });
    }, { passive: true });
  })();

  /* ── 10. ROOM CAPTION — caption при hover ────────────────────────────── */
  (function initRoomPhotoHover() {
    document.querySelectorAll('.room-photo').forEach(function (photo) {
      var caption = photo.querySelector('.room-caption');
      if (!caption) return;
      caption.classList.add('room-caption--animated');
    });
  })();

})();
