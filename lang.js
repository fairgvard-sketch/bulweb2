(function () {
  const LANG_KEY = 'bulochka-lang';
  var _langThumbFirst = true; // first positioning is instant (no slide-in on load)

  // Slide the "droplet" pill under the active button in each .lang-switch.
  // instant=true positions without animating (initial paint / resize).
  function moveLangThumbs(instant) {
    document.querySelectorAll('.lang-switch').forEach(function (sw) {
      var thumb = sw.querySelector('.lang-switch-thumb');
      if (!thumb) {
        thumb = document.createElement('span');
        thumb.className = 'lang-switch-thumb';
        sw.insertBefore(thumb, sw.firstChild);
      }
      var active = sw.querySelector('.lang-btn.active');
      if (!active) { thumb.classList.remove('ready'); return; }
      var x = active.offsetLeft;
      var w = active.offsetWidth;
      var apply = function () {
        thumb.style.width = w + 'px';
        thumb.style.transform = 'translateX(' + x + 'px)';
        thumb.classList.add('ready');
      };
      if (instant) {
        var prev = thumb.style.transition;
        thumb.style.transition = 'none';
        apply();
        // force reflow, then restore transition for subsequent moves
        void thumb.offsetWidth;
        thumb.style.transition = prev;
      } else {
        apply();
      }
    });
  }
  window.addEventListener('resize', function () { moveLangThumbs(true); });

  function applyLang(lang) {
    localStorage.setItem(LANG_KEY, lang);
    var isHe = lang === 'he';
    var isRu = lang === 'ru';
    document.documentElement.lang = lang;
    document.documentElement.dir = isHe ? 'rtl' : 'ltr';

    document.querySelectorAll('[data-he]').forEach(function (el) {
      // сохраняем английский контент только один раз (innerHTML — т.к. может содержать <em>, <strong> и т.д.)
      if (!el.dataset.en) el.dataset.en = el.innerHTML;
      if (isHe) {
        el.innerHTML = el.dataset.he;
      } else if (isRu && el.dataset.ru) {
        el.innerHTML = el.dataset.ru;
      } else {
        el.innerHTML = el.dataset.en;
      }
    });

    document.querySelectorAll('[data-placeholder-he]').forEach(function (el) {
      if (isHe) el.placeholder = el.dataset.placeholderHe;
      else if (isRu && el.dataset.placeholderRu) el.placeholder = el.dataset.placeholderRu;
      else el.placeholder = el.dataset.placeholderEn;
    });

    document.querySelectorAll('[data-he-html]').forEach(function (el) {
      if (!el.dataset.enHtml) el.dataset.enHtml = el.innerHTML;
      if (isHe) {
        el.innerHTML = el.dataset.heHtml;
      } else if (isRu && el.dataset.ruHtml) {
        el.innerHTML = el.dataset.ruHtml;
      } else {
        el.innerHTML = el.dataset.enHtml;
      }
    });

    document.querySelectorAll('.lang-btn, .lang-globe-option').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    moveLangThumbs(_langThumbFirst);
    _langThumbFirst = false;

    document.querySelectorAll('.menu-item-action').forEach(function (btn) {
      const itemName = (function() {
        const item = btn.closest('.menu-item');
        if (!item) return '';
        const nameEl = item.querySelector('.menu-item-name');
        return (nameEl?.dataset.en || nameEl?.textContent || '').trim().replace(/\s*◦\s*$/, '');
      })();
      const hasAddons = window.__ADDONS__ && window.__ADDONS__[itemName];
      if (hasAddons) {
        if (isHe) btn.textContent = 'הוסף תוספות';
        else if (isRu) btn.textContent = 'Добавить добавки →';
        else btn.textContent = 'Add ingredients →';
      } else {
        if (isHe) btn.textContent = '+ הוסף להזמנה';
        else if (isRu) btn.textContent = '+ В корзину';
        else btn.textContent = '+ Add to order';
      }
    });

    var soldOutText = isHe ? ' — אזל המלאי' : isRu ? ' — нет в наличии' : ' — sold out';
    document.querySelectorAll('.menu-item-name').forEach(function (el) {
      el.setAttribute('data-sold-out', soldOutText);
    });

    var extrasLabel = document.querySelector('.addon-extras-label');
    var doneBtn = document.querySelector('.addon-done-btn');
    var totalLabel = document.querySelector('.addon-total-label');
    if (extrasLabel) extrasLabel.textContent = isHe ? 'הוסף תוספות' : isRu ? 'Добавки' : 'Add extras';
    if (doneBtn) doneBtn.textContent = isHe ? 'סיום' : isRu ? 'Готово' : 'Done';
    if (totalLabel) totalLabel.textContent = isHe ? 'סה״כ' : isRu ? 'Итого' : 'Total';
    document.dispatchEvent(new CustomEvent('bulochka-lang-changed'));
  }

  document.querySelectorAll('.lang-btn, .lang-globe-option').forEach(function (btn) {
    btn.addEventListener('click', function () { applyLang(btn.dataset.lang); });
  });

  window._bulochkaApplyLang = applyLang;
  applyLang(localStorage.getItem(LANG_KEY) || 'he');

  // Re-snap the thumb once the page (and web fonts) finish loading, in case
  // button widths shifted after the first instant positioning.
  window.addEventListener('load', function () { moveLangThumbs(true); });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { moveLangThumbs(true); });
  }
})();
