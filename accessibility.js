(function () {
  var KEY = 'bulochka-a11y';
  var state = {};

  try { state = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { state = {}; }

  // ─── Apply saved state on load ───────────────
  applyAll();

  // ─── Build widget ────────────────────────────
  var btn = document.createElement('button');
  btn.id = 'a11y-btn';
  btn.setAttribute('aria-label', 'כלי נגישות');
  btn.innerHTML = '<svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 1a2 2 0 1 1-2 2 2 2 0 0 1 2-2zm8.79 4.546L14.776 6H9.223l-6.012-.454a.72.72 0 0 0-.168 1.428l6.106.97a.473.473 0 0 1 .395.409L10 12 6.865 22.067a.68.68 0 0 0 .313.808l.071.04a.707.707 0 0 0 .994-.338L12 13.914l3.757 8.663a.707.707 0 0 0 .994.338l.07-.04a.68.68 0 0 0 .314-.808L14 12l.456-3.647a.473.473 0 0 1 .395-.409l6.106-.97a.72.72 0 0 0-.168-1.428z"/></svg>';
  btn.setAttribute('aria-expanded', 'false');

  var panel = document.createElement('div');
  panel.id = 'a11y-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'כלי נגישות');
  panel.setAttribute('dir', 'rtl');

  var items = [
    { id: 'text-lg',      icon: '🔍+', label: 'הגדל טקסט',        toggle: true },
    { id: 'text-sm',      icon: '🔍−', label: 'הקטן טקסט',        toggle: true },
    { id: 'grayscale',    icon: '▤',   label: 'גווני אפור',        toggle: true },
    { id: 'contrast-hi',  icon: '◑',   label: 'ניגודיות גבוהה',   toggle: true },
    { id: 'contrast-lo',  icon: '◉',   label: 'ניגודיות הפוכה',   toggle: true },
    { id: 'bg-light',     icon: '💡',  label: 'רקע בהיר',         toggle: true },
    { id: 'links',        icon: '⛓',   label: 'הדגשת קישורים',    toggle: true },
    { id: 'readable',     icon: 'A',   label: 'פונט קריא',         toggle: true },
    { id: 'reset',        icon: '↺',   label: 'איפוס',             toggle: false },
  ];

  var title = document.createElement('div');
  title.className = 'a11y-title';
  title.textContent = 'כלי נגישות';
  panel.appendChild(title);

  items.forEach(function (item) {
    var row = document.createElement('button');
    row.className = 'a11y-item' + (item.toggle && state[item.id] ? ' active' : '');
    row.dataset.id = item.id;
    row.innerHTML = '<span class="a11y-item-icon">' + item.icon + '</span><span class="a11y-item-label">' + item.label + '</span>';
    row.addEventListener('click', function () { handleAction(item.id, row); });
    panel.appendChild(row);
  });

  var wrap = document.createElement('div');
  wrap.id = 'a11y-wrap';
  wrap.appendChild(panel);
  wrap.appendChild(btn);
  document.body.appendChild(wrap);

  btn.addEventListener('click', function () {
    var open = panel.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  document.addEventListener('click', function (e) {
    if (!wrap.contains(e.target)) {
      panel.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });

  // ─── Actions ─────────────────────────────────
  function handleAction(id, row) {
    if (id === 'reset') {
      state = {};
      localStorage.removeItem(KEY);
      applyAll();
      panel.querySelectorAll('.a11y-item').forEach(function (r) { r.classList.remove('active'); });
      return;
    }
    // text-lg and text-sm are mutually exclusive
    if (id === 'text-lg' && state['text-sm']) { toggle('text-sm'); updateRow('text-sm', false); }
    if (id === 'text-sm' && state['text-lg']) { toggle('text-lg'); updateRow('text-lg', false); }
    // contrast modes are mutually exclusive
    if (id === 'contrast-hi' && state['contrast-lo']) { toggle('contrast-lo'); updateRow('contrast-lo', false); }
    if (id === 'contrast-lo' && state['contrast-hi']) { toggle('contrast-hi'); updateRow('contrast-hi', false); }

    var on = toggle(id);
    updateRow(id, on);
    save();
  }

  function toggle(id) {
    state[id] = !state[id];
    apply(id, state[id]);
    return state[id];
  }

  function updateRow(id, on) {
    var row = panel.querySelector('[data-id="' + id + '"]');
    if (row) row.classList.toggle('active', on);
  }

  function apply(id, on) {
    var cl = document.documentElement.classList;
    if (id === 'text-lg' || id === 'text-sm') {
      applyFontSize();
      return;
    }
    var map = {
      'grayscale':   'a11y-grayscale',
      'contrast-hi': 'a11y-contrast-hi',
      'contrast-lo': 'a11y-contrast-lo',
      'bg-light':    'a11y-bg-light',
      'links':       'a11y-links',
      'readable':    'a11y-readable',
    };
    if (map[id]) cl.toggle(map[id], on);
  }

  var TEXT_SELECTOR = 'p, li, a, h1, h2, h3, h4, h5, h6, span, label, button, input, select, textarea, td, th';

  function applyFontSize() {
    var scale = state['text-lg'] ? 1.2 : state['text-sm'] ? 0.85 : 1;
    document.querySelectorAll(TEXT_SELECTOR).forEach(function (el) {
      // skip widget itself
      if (el.closest('#a11y-wrap')) return;
      if (!el._a11yBase) {
        el._a11yBase = parseFloat(window.getComputedStyle(el).fontSize);
      }
      el.style.fontSize = scale === 1 ? '' : (el._a11yBase * scale) + 'px';
    });
  }

  function applyAll() {
    Object.keys(state).forEach(function (id) { if (state[id]) apply(id, true); });
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }
})();
