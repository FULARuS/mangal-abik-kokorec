/* fx layer for v2 sites (pairs with fx.css): scroll progress, cursor glow in the hero,
   3D tilt on [data-tilt], heading underline on scroll, dish pop-up (.pop) in the corner. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const L = {
    en: { 'pop.k': 'Try this', 'pop.go': 'See the menu' },
    tr: { 'pop.k': 'Bunu deneyin', 'pop.go': 'Menüye bak' },
    ru: { 'pop.k': 'Попробуйте', 'pop.go': 'Смотреть меню' },
    ar: { 'pop.k': 'جرّب هذا', 'pop.go': 'شاهد القائمة' }
  };
  window.I18N = window.I18N || {};
  Object.keys(L).forEach(l => { window.I18N[l] = Object.assign({}, L[l], window.I18N[l] || {}); });

  const still = new URLSearchParams(location.search).has('static');
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches && !matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* scroll progress */
  const bar = $('.progress');
  const onScroll = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    if (bar) bar.style.setProperty('--p', h > 0 ? (scrollY / h).toFixed(4) : 0);
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* hero cursor glow */
  const hero = $('.v2-hero');
  if (hero && fine) hero.addEventListener('pointermove', e => {
    const r = hero.getBoundingClientRect();
    hero.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
    hero.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
  });

  /* tilt */
  if (fine) $$('[data-tilt]').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      el.style.setProperty('--ry', (x * 10).toFixed(2) + 'deg');
      el.style.setProperty('--rx', (-y * 10).toFixed(2) + 'deg');
    });
    el.addEventListener('pointerleave', () => { el.style.setProperty('--ry', '0deg'); el.style.setProperty('--rx', '0deg'); });
  });

  /* heading underline grows when the section shows up */
  const secs = $$('section');
  if (still || !('IntersectionObserver' in window)) secs.forEach(s => s.classList.add('seen'));
  else {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('seen'); io.unobserve(e.target); } }), { threshold: .25 });
    secs.forEach(s => io.observe(s));
  }

  /* dish pop-up: slides in after the visitor scrolls past the hero (or after 7 s), closable */
  const pop = $('.pop');
  if (pop) {
    const KEY = 'pop:' + location.pathname;
    let done = sessionStorage.getItem(KEY) === '1';
    const show = () => { if (!done) { pop.classList.add('show'); done = true; } };
    if (still) pop.classList.add('show');
    else if (!done) {
      const t = setTimeout(show, 7000);
      const h = () => { if (scrollY > innerHeight * .8) { clearTimeout(t); show(); removeEventListener('scroll', h); } };
      addEventListener('scroll', h, { passive: true });
    }
    const hide = () => { pop.classList.remove('show'); sessionStorage.setItem(KEY, '1'); };
    $('.x', pop).addEventListener('click', hide);
    $('.go', pop).addEventListener('click', hide);
  }
})();
