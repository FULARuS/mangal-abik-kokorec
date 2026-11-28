/* v2 actions. Loaded after <slug>/i18n.js and before site.js.
   - adds shared v2 labels to window.I18N (a site's own keys win)
   - body[data-action="order"]: "Add" buttons on menu items fill a basket -> WhatsApp order
   - form[data-book]: table / breakfast request -> WhatsApp message
   - [data-count]: counter with presets and option chips (e.g. mussels) -> WhatsApp message
   Message templates use {date} {time} {n} {name} {opt} placeholders. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const L = {
    en: { 'add': 'Add', 'o.items': '{n} in your order', 'o.send': 'Send order', 'o.clear': 'Clear', 'o.msg': 'Hello! I would like to order for pickup:', 'o.pick': 'Pickup time: …',
      'b.date': 'Date', 'b.time': 'Time', 'b.people': 'Guests', 'b.name': 'Name', 'b.note': 'Anything we should know?', 'b.send': 'Send request on WhatsApp',
      'b.msg': 'Hello! I would like to book a table on {date} at {time} for {n}. Name: {name}.', 'c.send': 'Send on WhatsApp', 'hours.h': 'Opening hours', 'rev.google': 'reviews on Google' },
    tr: { 'add': 'Ekle', 'o.items': 'Siparişinizde {n} ürün', 'o.send': 'Siparişi gönder', 'o.clear': 'Temizle', 'o.msg': 'Merhaba! Gel-al için sipariş vermek istiyorum:', 'o.pick': 'Alma saati: …',
      'b.date': 'Tarih', 'b.time': 'Saat', 'b.people': 'Kişi', 'b.name': 'İsim', 'b.note': 'Bilmemiz gereken bir şey var mı?', 'b.send': 'Talebi WhatsApp’tan gönder',
      'b.msg': 'Merhaba! {date} tarihinde saat {time} için {n} kişilik masa ayırtmak istiyorum. İsim: {name}.', 'c.send': 'WhatsApp’tan gönder', 'hours.h': 'Çalışma saatleri', 'rev.google': 'Google yorumu' },
    ru: { 'add': 'Добавить', 'o.items': 'В заказе: {n}', 'o.send': 'Отправить заказ', 'o.clear': 'Очистить', 'o.msg': 'Здравствуйте! Хочу заказать с собой:', 'o.pick': 'Заберу в: …',
      'b.date': 'Дата', 'b.time': 'Время', 'b.people': 'Гостей', 'b.name': 'Имя', 'b.note': 'Что нам стоит знать?', 'b.send': 'Отправить запрос в WhatsApp',
      'b.msg': 'Здравствуйте! Хочу забронировать стол: {date}, {time}, нас {n}. Имя: {name}.', 'c.send': 'Отправить в WhatsApp', 'hours.h': 'Часы работы', 'rev.google': 'отзывов в Google' },
    ar: { 'add': 'أضف', 'o.items': 'في طلبك: {n}', 'o.send': 'أرسل الطلب', 'o.clear': 'مسح', 'o.msg': 'مرحبًا! أريد أن أطلب للاستلام:', 'o.pick': 'وقت الاستلام: …',
      'b.date': 'التاريخ', 'b.time': 'الوقت', 'b.people': 'عدد الأشخاص', 'b.name': 'الاسم', 'b.note': 'هل هناك ما يجب أن نعرفه؟', 'b.send': 'أرسل الطلب عبر واتساب',
      'b.msg': 'مرحبًا! أريد حجز طاولة يوم {date} الساعة {time} لـ {n} أشخاص. الاسم: {name}.', 'c.send': 'أرسل عبر واتساب', 'hours.h': 'ساعات العمل', 'rev.google': 'تقييمًا على Google' }
  };
  window.I18N = window.I18N || {};
  Object.keys(L).forEach(l => { window.I18N[l] = Object.assign({}, L[l], window.I18N[l] || {}); });

  const T = k => (window.SITE ? window.SITE.tr(k) : k);
  const fill = (s, o) => s.replace(/\{(\w+)\}/g, (_, k) => (o[k] != null ? o[k] : ''));
  const wa = msg => window.SITE.waUrl(msg);

  /* ---------- order basket ---------- */
  const cart = new Map();
  const bar = $('.cart');
  function renderCart() {
    if (!bar) return;
    let n = 0; cart.forEach(q => { n += q; });
    bar.classList.toggle('show', n > 0);
    $('.sum b', bar).textContent = fill(T('o.items'), { n });
    $('.sum span', bar).textContent = [...cart].map(([k, q]) => `${q} × ${k}`).join(', ');
    const lines = [...cart].map(([k, q]) => `${q} × ${k}`).join('\n');
    $('.send', bar).href = wa(`${T('o.msg')}\n${lines}\n${T('o.pick')}`);
    $$('.add').forEach(b => {
      const q = cart.get(b.dataset.item) || 0;
      b.classList.toggle('has', q > 0);
      if (b.parentNode.classList.contains('addw')) b.parentNode.classList.toggle('has', q > 0);
      $('.qty', b).textContent = q;
    });
  }
  $$('.add').forEach(b => b.addEventListener('click', () => {
    cart.set(b.dataset.item, (cart.get(b.dataset.item) || 0) + 1); renderCart();
  }));
  $$('.sub').forEach(b => b.addEventListener('click', () => {
    const q = (cart.get(b.dataset.item) || 0) - 1;
    if (q > 0) cart.set(b.dataset.item, q); else cart.delete(b.dataset.item);
    renderCart();
  }));
  if (bar) $('.clr', bar).addEventListener('click', () => { cart.clear(); renderCart(); });

  /* ---------- table / breakfast request ---------- */
  const form = $('form[data-book]');
  if (form) {
    const d = form.elements.date;
    const today = new Date(); const iso = x => x.toISOString().slice(0, 10);
    d.min = iso(today); d.value = iso(today);
    form.addEventListener('submit', e => {
      e.preventDefault();
      const f = form.elements;
      const dt = f.date.value ? new Date(f.date.value + 'T12:00').toLocaleDateString(window.SITE.lang, { weekday: 'long', day: 'numeric', month: 'long' }) : '';
      let msg = fill(T('b.msg'), { date: dt, time: f.time.value, n: f.people.value, name: f.name.value || '…' });
      if (f.note && f.note.value.trim()) msg += '\n' + f.note.value.trim();
      window.open(wa(msg), '_blank', 'noopener');
    });
  }

  /* ---------- counter (e.g. mussels) ---------- */
  const cnt = $('[data-count]');
  if (cnt) {
    const out = $('output', cnt), step = +cnt.dataset.step || 1;
    let n = +cnt.dataset.start || 10;
    const opts = {};
    const send = $('.send', cnt.closest('.req') || document);
    const render = () => {
      out.textContent = n;
      $$('[data-preset]').forEach(b => b.classList.toggle('on', +b.dataset.preset === n));
      const opt = Object.values(opts).filter(Boolean).map(k => T(k)).join(', ');
      send.href = wa(fill(T('c.msg'), { n, opt: opt ? ' (' + opt + ')' : '' }));
    };
    $('[data-dec]', cnt).addEventListener('click', () => { n = Math.max(step, n - step); render(); });
    $('[data-inc]', cnt).addEventListener('click', () => { n += step; render(); });
    $$('[data-preset]').forEach(b => b.addEventListener('click', () => { n = +b.dataset.preset; render(); }));
    $$('[data-opt]').forEach(b => b.addEventListener('click', () => {
      const g = b.dataset.group;
      $$(`[data-group="${g}"]`).forEach(x => x.classList.toggle('on', x === b && !b.classList.contains('on')));
      opts[g] = b.classList.contains('on') ? b.dataset.opt : null; render();
    }));
    document.addEventListener('langchange', render);
    setTimeout(render, 0);
  }

  document.addEventListener('langchange', renderCart);
})();
