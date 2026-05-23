(function () {
  const LANG_KEY = 'bulochka-lang';

  function applyLang(lang) {
    localStorage.setItem(LANG_KEY, lang);
    var isHe = lang === 'he';
    document.documentElement.lang = lang;
    document.documentElement.dir = isHe ? 'rtl' : 'ltr';

    document.querySelectorAll('[data-he]').forEach(function (el) {
      var heVal = el.dataset.he;
      if (!el.dataset.en) el.dataset.en = el.innerHTML;
      var enVal = el.dataset.en;
      var hasMarkup = /<[a-z]/i.test(heVal) || /<[a-z]/i.test(enVal);
      el.innerHTML = isHe ? heVal : enVal;
    });

    document.querySelectorAll('[data-he-html]').forEach(function (el) {
      if (!el.dataset.enHtml) el.dataset.enHtml = el.innerHTML;
      el.innerHTML = isHe ? el.dataset.heHtml : el.dataset.enHtml;
    });

    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    document.querySelectorAll('.menu-item-action').forEach(function (btn) {
      btn.textContent = isHe ? 'הוסף להזמנה ←' : 'Add Ingredients →';
    });

    var extrasLabel = document.querySelector('.addon-extras-label');
    var doneBtn = document.querySelector('.addon-done-btn');
    var totalLabel = document.querySelector('.addon-total-label');
    if (extrasLabel) extrasLabel.textContent = isHe ? 'הוסף תוספות' : 'Add extras';
    if (doneBtn) doneBtn.textContent = isHe ? 'סיום' : 'Done';
    if (totalLabel) totalLabel.textContent = isHe ? 'סה״כ' : 'Total';
  }

  document.querySelectorAll('.lang-btn').forEach(function (btn) {
    btn.addEventListener('click', function () { applyLang(btn.dataset.lang); });
  });

  applyLang(localStorage.getItem(LANG_KEY) || 'en');
})();
