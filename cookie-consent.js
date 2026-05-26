(function () {
  var GA_ID = 'G-1X6T5CVR62';
  var KEY   = 'bulochka-consent';

  var T = {
    en: { msg: 'We use Google Analytics to understand site traffic.',          ok: 'Accept',  no: 'Decline'   },
    he: { msg: 'אנו משתמשים ב-Google Analytics כדי להבין את תנועת האתר.',    ok: 'אשר',     no: 'דחה'        },
    ru: { msg: 'Мы используем Google Analytics для анализа посещаемости.',     ok: 'Принять', no: 'Отклонить' },
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

  var consent = localStorage.getItem(KEY);
  if (consent === 'yes') { loadGA(); return; }
  if (consent === 'no')  { window.__trackingAllowed = false; return; }

  window.__trackingAllowed = false;
  var lang = localStorage.getItem('bulochka-lang') || 'he';
  var t    = T[lang] || T.en;

  var banner = document.createElement('div');
  banner.id  = 'cookie-banner';
  if (lang === 'he') banner.setAttribute('dir', 'rtl');
  banner.innerHTML =
    '<p class="cookie-msg">' + t.msg + '</p>' +
    '<div class="cookie-btns">' +
      '<button id="cookie-ok">'  + t.ok + '</button>' +
      '<button id="cookie-no">'  + t.no + '</button>' +
    '</div>';
  document.body.appendChild(banner);

  document.getElementById('cookie-ok').onclick = function () {
    localStorage.setItem(KEY, 'yes');
    banner.remove();
    loadGA();
  };
  document.getElementById('cookie-no').onclick = function () {
    localStorage.setItem(KEY, 'no');
    banner.remove();
  };
})();
