(function () {
  var GA_ID = 'G-1X6T5CVR62';
  var KEY   = 'bulochka-consent';

  var T = {
    en: {
      msg:    'We use cookies (cookies) to improve your browsing experience. To learn more – see our <a href="cookie-policy" class="cookie-link">privacy policy</a>.',
      ok:     'Accept',
    },
    he: {
      msg:    'אנחנו משתמשים ב״קבצי עוגיות״ (cookies) לשיפור חוויית הגלישה והתאמת תוכן. לפרטים נוספים – עיינו ב<a href="cookie-policy" class="cookie-link">מדיניות הפרטיות</a> שלנו.',
      ok:     'קראתי',
    },
    ru: {
      msg:    'Мы используем файлы cookie для улучшения работы сайта. Подробнее — в нашей <a href="cookie-policy" class="cookie-link">политике конфиденциальности</a>.',
      ok:     'Принять',
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
      '<span class="cookie-icon"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="9" cy="9" r="8" stroke="#7a5a3f" stroke-width="1.2"/><circle cx="6" cy="7" r="1.1" fill="#7a5a3f"/><circle cx="11" cy="6.5" r="0.8" fill="#7a5a3f"/><circle cx="11.5" cy="11" r="1.1" fill="#7a5a3f"/><circle cx="7" cy="11.5" r="0.8" fill="#7a5a3f"/><circle cx="9" cy="9" r="0.7" fill="#7a5a3f"/></svg></span>' +
      '<p class="cookie-msg">' + t.msg + '</p>' +
      '<button id="cookie-ok">' + t.ok + '</button>' +
    '</div>';

  document.body.appendChild(wrap);

  document.getElementById('cookie-ok').onclick = function () {
    localStorage.setItem(KEY, 'yes');
    dismiss(wrap);
    loadGA();
  };
})();
