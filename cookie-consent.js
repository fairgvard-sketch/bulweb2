(function () {
  var GA_ID = 'G-1X6T5CVR62';
  var KEY   = 'bulochka-consent';

  var T = {
    en: {
      title: 'We use cookies',
      msg:   'We use cookies to analyse how visitors use our site and to improve your experience. You can accept or decline analytics cookies below.',
      ok:    'Accept all',
      no:    'Decline',
    },
    he: {
      title: 'אנחנו משתמשים בעוגיות',
      msg:   'אנחנו משתמשים בעוגיות כדי לנתח כיצד המבקרים משתמשים באתר ולשפר את חוויית הגלישה שלך. באפשרותך לאשר או לדחות עוגיות ניתוח.',
      ok:    'אשר הכל',
      no:    'דחה',
    },
    ru: {
      title: 'Мы используем cookies',
      msg:   'Мы используем файлы cookie для анализа трафика и улучшения вашего опыта. Вы можете принять или отклонить аналитические cookie.',
      ok:    'Принять все',
      no:    'Отклонить',
    },
  };

  function loadGA() {
    window.__trackingAllowed = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
  }

  function dismiss(wrap) {
    wrap.style.transition = 'opacity 0.22s, transform 0.22s';
    wrap.style.opacity    = '0';
    wrap.style.transform  = 'translateY(16px)';
    setTimeout(function () { wrap.remove(); }, 240);
  }

  var consent = localStorage.getItem(KEY);
  if (consent === 'yes') { loadGA(); return; }
  if (consent === 'no')  { window.__trackingAllowed = false; return; }

  window.__trackingAllowed = false;

  var lang = localStorage.getItem('bulochka-lang') || 'he';
  var t    = T[lang] || T.en;
  var isRtl = lang === 'he';

  var wrap = document.createElement('div');
  wrap.id  = 'cookie-wrap';

  wrap.innerHTML =
    '<div id="cookie-banner"' + (isRtl ? ' dir="rtl"' : '') + '>' +
      '<div class="cookie-top">' +
        '<span class="cookie-icon">🍪</span>' +
        '<p class="cookie-title">' + t.title + '</p>' +
      '</div>' +
      '<p class="cookie-msg">' + t.msg + '</p>' +
      '<div class="cookie-btns">' +
        '<button id="cookie-ok">'  + t.ok + '</button>' +
        '<button id="cookie-no">'  + t.no + '</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(wrap);

  document.getElementById('cookie-ok').onclick = function () {
    localStorage.setItem(KEY, 'yes');
    dismiss(wrap);
    loadGA();
  };
  document.getElementById('cookie-no').onclick = function () {
    localStorage.setItem(KEY, 'no');
    dismiss(wrap);
  };
})();
