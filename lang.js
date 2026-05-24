(function () {
  const LANG_KEY = 'bulochka-lang';

  function applyLang(lang) {
    localStorage.setItem(LANG_KEY, lang);
    var isHe = lang === 'he';
    var isRu = lang === 'ru';
    document.documentElement.lang = lang;
    document.documentElement.dir = isHe ? 'rtl' : 'ltr';

    document.querySelectorAll('[data-he]').forEach(function (el) {
      if (!el.dataset.en) el.dataset.en = el.innerHTML;
      if (isHe) {
        el.innerHTML = el.dataset.he;
      } else if (isRu && el.dataset.ru) {
        el.innerHTML = el.dataset.ru;
      } else {
        el.innerHTML = el.dataset.en;
      }
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

    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    document.querySelectorAll('.menu-item-action').forEach(function (btn) {
      if (isHe) btn.textContent = 'הוסף להזמנה ←';
      else if (isRu) btn.textContent = 'Добавить →';
      else btn.textContent = 'Add to order →';
    });

    var extrasLabel = document.querySelector('.addon-extras-label');
    var doneBtn = document.querySelector('.addon-done-btn');
    var totalLabel = document.querySelector('.addon-total-label');
    if (extrasLabel) extrasLabel.textContent = isHe ? 'הוסף תוספות' : isRu ? 'Добавки' : 'Add extras';
    if (doneBtn) doneBtn.textContent = isHe ? 'סיום' : isRu ? 'Готово' : 'Done';
    if (totalLabel) totalLabel.textContent = isHe ? 'סה״כ' : isRu ? 'Итого' : 'Total';
  }

  document.querySelectorAll('.lang-btn').forEach(function (btn) {
    btn.addEventListener('click', function () { applyLang(btn.dataset.lang); });
  });

  applyLang(localStorage.getItem(LANG_KEY) || 'en');
})();
