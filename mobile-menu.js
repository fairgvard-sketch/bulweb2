(function () {
  const p = window.location.pathname;
  const isHome = p === '/' || p.endsWith('/index.html') || p.endsWith('/');
  const storyHref = isHome ? '#story' : 'index.html#story';

  document.body.insertAdjacentHTML('afterbegin', `
<div class="mobile-menu" id="mobileMenu">
  <div class="mobile-menu-banner">
    <img src="img/Main page/background.webp" alt="" loading="eager">
  </div>
  <div class="mobile-menu-content">
  <a href="index.html" data-en="Home" data-he="ראשי" data-ru="Главная">Home</a>
  <a href="menu.html" data-en="Menu" data-he="תפריט" data-ru="Меню">Menu</a>
  <a href="${storyHref}" data-en="Our story" data-he="הסיפור שלנו" data-ru="О нас">Our story</a>
  <a href="careers.html" data-en="Work with us" data-he="עבוד איתנו" data-ru="Работа у нас">Work with us</a>
  <a href="events.html" data-en="Events" data-he="אירועים" data-ru="Мероприятия">Events</a>
  <a href="tel:+972529662724" class="mobile-menu-reserve" data-en="Reserve a table →" data-he="הזמן שולחן →" data-ru="Забронировать стол →">Reserve a table →</a>
  <div class="mobile-menu-secondary">
    <a href="https://www.instagram.com/bulochka.pt" target="_blank" class="mobile-menu-secondary-link">Instagram</a>
    <a href="https://www.facebook.com/bulochka.bulochka.2025" target="_blank" class="mobile-menu-secondary-link">Facebook</a>
    <a href="https://www.google.com/search?q=Bulochka+Petah+Tikva" target="_blank" class="mobile-menu-secondary-link" data-en="Google Reviews" data-he="ביקורות גוגל" data-ru="Отзывы на Google">Google Reviews</a>
    <div class="mobile-menu-lang" id="mobileLangToggle">
      <span data-en="Language" data-he="שפה" data-ru="Язык">Language</span>
      <span class="mobile-menu-lang-arrow">›</span>
    </div>
    <div class="mobile-menu-lang-options" id="mobileLangOptions">
      <button class="mobile-lang-btn" data-lang="en">English</button>
      <button class="mobile-lang-btn" data-lang="he">עברית</button>
      <button class="mobile-lang-btn" data-lang="ru">Русский</button>
    </div>
  </div>
  </div>
</div>`);

  const toggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  function openMenu() {
    mobileMenu.classList.add('open');
    toggle.classList.add('is-open');
    document.body.classList.add('menu-open');
  }
  function closeMenu() {
    mobileMenu.classList.remove('open');
    toggle.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  }
  toggle.addEventListener('click', () => mobileMenu.classList.contains('open') ? closeMenu() : openMenu());
  mobileMenu.querySelectorAll('.mobile-menu-content a').forEach(l => l.addEventListener('click', closeMenu));

  const langToggle = document.getElementById('mobileLangToggle');
  const langOptions = document.getElementById('mobileLangOptions');
  langToggle.addEventListener('click', () => {
    langToggle.classList.toggle('expanded');
    langOptions.classList.toggle('open');
  });
  document.querySelectorAll('.mobile-lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const navBtn = document.querySelector(`.lang-btn[data-lang="${btn.dataset.lang}"]`);
      if (navBtn) navBtn.click();
      document.querySelectorAll('.mobile-lang-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.lang === btn.dataset.lang);
      });
    });
  });
})();
