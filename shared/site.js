/* Shared behaviour: icons, EN/TR/RU switch, WhatsApp links, live "open now" (Istanbul time),
   hours table, menu tabs, scroll reveal, rating bars, gallery lightbox. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- icons ---------- */
  const P = {
    wa: '<path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.04 21.8h-.01a9.8 9.8 0 0 1-5-1.37l-.36-.21-3.72.98 1-3.63-.24-.37a9.8 9.8 0 0 1-1.5-5.22c0-5.42 4.41-9.83 9.84-9.83 2.63 0 5.1 1.03 6.95 2.88a9.77 9.77 0 0 1 2.88 6.95c0 5.42-4.41 9.83-9.84 9.83zm8.37-18.2A11.76 11.76 0 0 0 12.04 0C5.5 0 .2 5.3.2 11.82c0 2.08.54 4.12 1.58 5.91L.1 24l6.42-1.68a11.8 11.8 0 0 0 5.52 1.4h.01c6.53 0 11.84-5.3 11.84-11.82 0-3.16-1.23-6.13-3.47-8.37z"/>',
    star: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
    pin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    arrow: '<path d="M5 12h14M12 5l7 7-7 7"/>',
    music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
    glass: '<path d="M8 22h8M12 11v11M4 3h16l-8 8z"/>',
    flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>',
    receipt: '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z"/><path d="M8 7h8M8 11h8M8 15h5"/>',
    scale: '<path d="M12 3v18M7 21h10M5 7h14M5 7l-3 7a3 3 0 0 0 6 0zM19 7l-3 7a3 3 0 0 0 6 0z"/>',
    fish: '<path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6z"/><path d="M18 12v.01M16 17.93a9.77 9.77 0 0 1 0-11.86M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.5-1 5 .23 6.5-1.24 1.5-1.24 5-.23 6.5C5.58 18.03 7 16 7 13.33"/>',
    chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
    moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
    check: '<path d="M20 6L9 17l-5-5"/>',
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    tea: '<path d="M17 8h1a4 4 0 1 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4zM6 2v2M10 2v2M14 2v2"/>',
    card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
    bag: '<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0"/>',
    eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
    wave: '<path d="M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0M2 17c2-2 4-2 6 0s4 2 6 0 4-2 6 0M2 7c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/>',
    sparkle: '<path d="M12 3l1.9 5.6L19.5 10.5l-5.6 1.9L12 18l-1.9-5.6L4.5 10.5l5.6-1.9z"/>',
    heart: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    map: '<path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4z"/><path d="M8 2v16M16 6v16"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    google: '<path d="M21.6 12.23c0-.68-.06-1.36-.18-2.02H12v3.83h5.4a4.6 4.6 0 0 1-2 3.03v2.5h3.23c1.9-1.75 2.97-4.32 2.97-7.34z" fill="#4285F4"/><path d="M12 22c2.7 0 4.96-.9 6.62-2.43l-3.23-2.5c-.9.6-2.04.96-3.39.96-2.6 0-4.81-1.76-5.6-4.12H3.07v2.58A10 10 0 0 0 12 22z" fill="#34A853"/><path d="M6.4 13.91a6 6 0 0 1 0-3.82V7.51H3.07a10 10 0 0 0 0 8.98z" fill="#FBBC05"/><path d="M12 5.96c1.47 0 2.79.5 3.83 1.5l2.86-2.86A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.93 5.51L6.4 10.1C7.19 7.72 9.4 5.96 12 5.96z" fill="#EA4335"/>'
  };
  const FILLED = new Set(['wa', 'star', 'google']);
  const svg = n => FILLED.has(n)
    ? `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${P[n] || ''}</svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || ''}</svg>`;
  $$('i[data-icon]').forEach(i => { i.outerHTML = svg(i.dataset.icon); });
  $$('[data-stars]').forEach(el => { el.innerHTML = svg('star').repeat(+el.dataset.stars || 5); });

  /* ---------- i18n ---------- */
  const B = document.body;
  const PHONE = B.dataset.phone;
  const ST = {
    en: { open: 'Open now', closed: 'Closed now', closes: 'until', opens: 'opens at', off: 'Closed' },
    tr: { open: 'Şu an açık', closed: 'Şu an kapalı', closes: 'kapanış', opens: 'açılış', off: 'Kapalı' },
    ru: { open: 'Сейчас открыто', closed: 'Сейчас закрыто', closes: 'до', opens: 'откроется в', off: 'Закрыто' },
    ar: { open: 'مفتوح الآن', closed: 'مغلق الآن', closes: 'حتى', opens: 'يفتح الساعة', off: 'مغلق' }
  };
  /* labels shared by every site: review origin, common buttons */
  const LN = {
    en: { en: 'English', tr: 'Turkish', ru: 'Russian', de: 'German', ar: 'Arabic' },
    tr: { en: 'İngilizceden', tr: 'Türkçeden', ru: 'Rusçadan', de: 'Almancadan', ar: 'Arapçadan' },
    ru: { en: 'английского', tr: 'турецкого', ru: 'русского', de: 'немецкого', ar: 'арабского' },
    ar: { en: 'الإنجليزية', tr: 'التركية', ru: 'الروسية', de: 'الألمانية', ar: 'العربية' }
  };
  const fromTxt = (l, src) => src === l ? 'Google' :
    l === 'en' ? `Google · translated from ${LN.en[src]}` :
    l === 'tr' ? `Google · ${LN.tr[src]} çevrildi` :
    l === 'ru' ? `Google · перевод с ${LN.ru[src]}` :
    `Google · مترجم من ${LN.ar[src]}`;
  const SHARED = {
    en: { 'm.call': 'Call', 'm.map': 'Map', 'cta.route': 'Get directions', 'rev.topics': 'What guests mention most', 'rev.all': 'All reviews on Google', 'rev.p': 'Real Google reviews. If a guest wrote in another language, we translated it.', 'chat.foot': 'Your question…', 'chat.send': 'Ask on WhatsApp' },
    tr: { 'm.call': 'Ara', 'm.map': 'Harita', 'cta.route': 'Yol tarifi', 'rev.topics': 'Misafirlerin en çok bahsettikleri', 'rev.all': 'Tüm yorumlar Google’da', 'rev.p': 'Google’daki gerçek yorumlar. Başka dilde yazılanları biz çevirdik.', 'chat.foot': 'Sorunuz…', 'chat.send': 'WhatsApp’tan sor' },
    ru: { 'm.call': 'Позвонить', 'm.map': 'Карта', 'cta.route': 'Маршрут', 'rev.topics': 'О чём гости пишут чаще всего', 'rev.all': 'Все отзывы в Google', 'rev.p': 'Настоящие отзывы из Google. Если гость писал на другом языке, мы перевели.', 'chat.foot': 'Ваш вопрос…', 'chat.send': 'Спросить в WhatsApp' },
    ar: { 'm.call': 'اتصال', 'm.map': 'الخريطة', 'cta.route': 'الاتجاهات', 'rev.topics': 'أكثر ما يذكره الضيوف', 'rev.all': 'كل التقييمات على Google', 'rev.p': 'تقييمات حقيقية من Google. ما كُتب بلغة أخرى ترجمناه.', 'chat.foot': 'سؤالك…', 'chat.send': 'اسأل على واتساب' }
  };
  const D = {};
  Object.keys(ST).forEach(l => {
    D[l] = Object.assign({}, SHARED[l], (window.I18N || {})[l]);
    ['en', 'tr', 'ru', 'de', 'ar'].forEach(src => { D[l]['from.' + src] = fromTxt(l, src); });
  });
  let lang = 'en';
  const orig = new Map();
  const tr = k => (D[lang] && D[lang][k] != null) ? D[lang][k] : (D.en && D.en[k] != null ? D.en[k] : '');

  function apply(l) {
    lang = ST[l] ? l : 'en';
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    $$('[data-i18n]').forEach(el => {
      if (!orig.has(el)) orig.set(el, el.innerHTML);
      const v = (D[lang] || {})[el.dataset.i18n];
      el.innerHTML = v != null ? v : orig.get(el);
    });
    $$('[data-lang]').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
    try { localStorage.setItem('site-lang', lang); } catch (e) {}
    waLinks(); status(); hoursTable();
    document.dispatchEvent(new CustomEvent('langchange', { detail: lang }));
  }

  /* ---------- WhatsApp ---------- */
  const waUrl = msg => 'https://wa.me/' + PHONE + (msg ? '?text=' + encodeURIComponent(msg) : '');
  function waLinks() {
    $$('[data-wa]').forEach(a => {
      a.href = waUrl(tr('wa.' + a.dataset.wa));
      a.target = '_blank'; a.rel = 'noopener';
    });
  }

  /* ---------- hours & live status (Europe/Istanbul) ---------- */
  const H = JSON.parse(B.dataset.hours || 'null'); // Mon..Sun, "HH:MM-HH:MM" (overnight allowed) or null
  const toM = s => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };
  const fmt = m => { m = ((m % 1440) + 1440) % 1440; return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); };
  function nowIst() {
    const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Istanbul', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
    const g = t => parts.find(p => p.type === t).value;
    return { d: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(g('weekday')), m: (+g('hour')) * 60 + (+g('minute')) };
  }
  function range(d) {
    const s = H && H[((d % 7) + 7) % 7];
    if (!s) return null;
    let [a, b] = s.split('-').map(toM);
    if (b <= a) b += 1440;
    return [a, b];
  }
  function status() {
    if (!H) return;
    const n = nowIst(), t = range(n.d), y = range(n.d - 1), s = ST[lang];
    let closeAt = null;
    if (t && n.m >= t[0] && n.m < t[1]) closeAt = t[1];
    else if (y && n.m + 1440 < y[1]) closeAt = y[1] - 1440;
    let txt;
    if (closeAt != null) txt = `${s.open} · ${s.closes} ${fmt(closeAt)}`;
    else {
      let nx = null;
      if (t && n.m < t[0]) nx = t[0];
      else for (let i = 1; i < 8; i++) { const r = range(n.d + i); if (r) { nx = r[0]; break; } }
      txt = `${s.closed}${nx != null ? ' · ' + s.opens + ' ' + fmt(nx) : ''}`;
    }
    $$('[data-status]').forEach(e => { e.innerHTML = `<span class="dot ${closeAt != null ? '' : 'off'}"></span>${txt}`; });
  }
  function hoursTable() {
    const el = $('[data-hours-table]');
    if (!el || !H) return;
    const n = nowIst();
    const df = new Intl.DateTimeFormat(lang, { weekday: 'long', timeZone: 'UTC' });
    const days = [...Array(7)].map((_, i) => { const d = df.format(new Date(Date.UTC(2024, 0, 1 + i))); return d.charAt(0).toUpperCase() + d.slice(1); });
    el.innerHTML = H.map((s, i) => `<tr class="${i === n.d ? 'today' : ''}"><td>${days[i]}</td><td>${s ? s.replace('-', ' – ') : ST[lang].off}</td></tr>`).join('');
  }
  setInterval(status, 60000);

  /* ---------- menu tabs ---------- */
  $$('[data-tabs]').forEach(w => {
    const tabs = $$('[data-tab]', w);
    tabs.forEach(t => t.addEventListener('click', () => {
      tabs.forEach(x => x.classList.toggle('active', x === t));
      $$('[data-panel]', w).forEach(p => p.classList.toggle('active', p.dataset.panel === t.dataset.tab));
    }));
  });

  /* ---------- nav ---------- */
  const nav = $('.nav');
  const onScroll = () => nav && nav.classList.toggle('scrolled', scrollY > 40);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- reveal & bars ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    $$('.bar i b', e.target).forEach(b => { b.style.width = b.dataset.w + '%'; });
    io.unobserve(e.target);
  }), { threshold: .12, rootMargin: '0px 0px -40px 0px' });
  // ?static=1 shows everything at once (used by scripts/shot_site.py screenshots)
  if (new URLSearchParams(location.search).has('static')) {
    document.head.insertAdjacentHTML('beforeend', '<style>.hero{min-height:880px!important}</style>');
    $$('.reveal').forEach(el => { el.classList.add('in'); el.style.transition = 'none'; });
    $$('.bar i b').forEach(b => { b.style.width = b.dataset.w + '%'; });
  } else {
    $$('.reveal').forEach(el => io.observe(el));
  }

  /* ---------- lightbox ---------- */
  const lb = document.createElement('div');
  lb.className = 'lightbox'; lb.innerHTML = '<img alt="">';
  document.body.appendChild(lb);
  lb.addEventListener('click', () => lb.classList.remove('open'));
  addEventListener('keydown', e => { if (e.key === 'Escape') lb.classList.remove('open'); });
  $$('.gallery img').forEach(img => img.addEventListener('click', () => {
    lb.firstChild.src = img.src.replace(/=w\d+[^/]*$/, '=w1800');
    lb.firstChild.alt = img.alt; lb.classList.add('open');
  }));

  /* ---------- misc ---------- */
  $$('[data-year]').forEach(e => { e.textContent = new Date().getFullYear(); });
  $$('[data-lang]').forEach(b => b.addEventListener('click', () => apply(b.dataset.lang)));
  window.SITE = { waUrl, tr, get lang() { return lang; } };

  // Every site opens in Turkish. Only an explicit ?lang=en|ru|ar in the link overrides it.
  let start = 'tr';
  const qp = new URLSearchParams(location.search).get('lang');
  if (qp && ST[qp]) start = qp;
  apply(ST[start] ? start : 'en');
})();
