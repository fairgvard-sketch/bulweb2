(function () {
  const p = window.location.pathname;
  const isHome = p === '/' || p.endsWith('/index.html') || p.endsWith('/');
  const storyHref = isHome ? '#story' : 'index.html#story';

  document.body.insertAdjacentHTML('afterbegin', `
<div class="mobile-menu" id="mobileMenu">
  <span class="mobile-menu-close" id="menuClose" data-en="Close ✕" data-he="סגור ✕">Close ✕</span>
  <a href="index.html" data-en="Home" data-he="ראשי">Home</a>
  <a href="menu.html" data-en="Menu" data-he="תפריט">Menu</a>
  <a href="${storyHref}" data-en="Our story" data-he="הסיפור שלנו">Our story</a>
  <a href="careers.html" data-en="Work with us" data-he="עבוד איתנו">Work with us</a>
  <a href="events.html" data-en="Events" data-he="אירועים">Events</a>
  <a href="tel:+972529662724" class="mobile-menu-reserve" data-en="Reserve a table →" data-he="הזמן שולחן →">Reserve a table →</a>
  <div class="mobile-menu-secondary">
    <a href="https://www.instagram.com/bulochka.pt" target="_blank" class="mobile-menu-secondary-link">Instagram</a>
    <a href="https://www.facebook.com/bulochka.bulochka.2025" target="_blank" class="mobile-menu-secondary-link">Facebook</a>
    <a href="https://www.google.com/search?q=Bulochka+Petah+Tikva" target="_blank" class="mobile-menu-secondary-link" data-en="Google Reviews" data-he="ביקורות גוגל">Google Reviews</a>
    <div class="mobile-menu-lang" id="mobileLangToggle">
      <span data-en="Language" data-he="שפה">Language</span>
      <span class="mobile-menu-lang-arrow">›</span>
    </div>
    <div class="mobile-menu-lang-options" id="mobileLangOptions">
      <button class="mobile-lang-btn" data-lang="en">English</button>
      <button class="mobile-lang-btn" data-lang="he">עברית</button>
    </div>
  </div>
</div>`);

  const toggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeBtn = document.getElementById('menuClose');
  toggle.addEventListener('click', () => mobileMenu.classList.add('open'));
  closeBtn.addEventListener('click', () => mobileMenu.classList.remove('open'));
  mobileMenu.querySelectorAll('a').forEach(l => l.addEventListener('click', () => mobileMenu.classList.remove('open')));

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
