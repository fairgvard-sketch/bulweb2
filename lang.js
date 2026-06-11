(function () {
  const LANG_KEY = 'bulochka-lang';

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
})();
