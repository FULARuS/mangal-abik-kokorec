/* Shared engine for hair-salon demo sites: language switch (Turkish first), scroll reveal and the
   "digital window" booking wizard: master -> day -> time -> service -> WhatsApp request.
   Each site defines window.SALON (config) and window.I18N (texts: tr/en/ru) before loading this file.
   SALON = { slug, title, phone:'905...', step:30, hours:{0:[open,close]|null ... 6}, // 0 = Sunday, "HH:MM"
             masters:[{id,name,role:{tr,en,ru},init,photo?}], services:[{id}] }
   Booking never talks to a server: it builds a WhatsApp message to the salon (Turkish text). */
(function () {
  const S = window.SALON, TXT = window.I18N;
  const BK = {
    tr: { 'bk.s1': 'Usta', 'bk.s2': 'Gün', 'bk.s3': 'Saat', 'bk.s4': 'Hizmet', 'bk.m': 'Ustanı seç', 'bk.d': 'Günü seç', 'bk.t': 'Saati seç', 'bk.s': 'Ne yaptıralım?',
      'bk.any': 'Fark etmez', 'bk.anyr': 'İlk boş koltuk', 'bk.free': 'En yakın boşluk', 'bk.today': 'Bugün', 'bk.tom': 'Yarın', 'bk.closed': 'Kapalı', 'bk.none': 'Bu gün boş saat yok',
      'bk.morning': 'Sabah', 'bk.noon': 'Öğleden sonra', 'bk.eve': 'Akşam', 'bk.free.n': 'boş', 'bk.name': 'Adın (isteğe bağlı)', 'bk.go': 'WhatsApp’tan randevu iste', 'bk.back': 'Geri', 'bk.next': 'Devam',
      'bk.sum': 'Randevun', 'bk.l.m': 'Usta', 'bk.l.d': 'Gün', 'bk.l.t': 'Saat', 'bk.l.s': 'Hizmet', 'bk.live': 'canlı takvim', 'bk.hint': 'Seçimlerini tamamla, talep salonun WhatsApp’ına gitsin.',
      'bk.ready': 'Hazır! Talebi gönder, salon onaylasın.', 'bk.demo': 'Demo: boş/dolu saatler örnektir. Canlı sitede salonun kendi takviminden gelir.' },
    en: { 'bk.s1': 'Master', 'bk.s2': 'Day', 'bk.s3': 'Time', 'bk.s4': 'Service', 'bk.m': 'Choose your master', 'bk.d': 'Pick a day', 'bk.t': 'Pick a time', 'bk.s': 'What are we doing?',
      'bk.any': 'Any master', 'bk.anyr': 'First free chair', 'bk.free': 'Next free', 'bk.today': 'Today', 'bk.tom': 'Tomorrow', 'bk.closed': 'Closed', 'bk.none': 'No free slots this day',
      'bk.morning': 'Morning', 'bk.noon': 'Afternoon', 'bk.eve': 'Evening', 'bk.free.n': 'free', 'bk.name': 'Your name (optional)', 'bk.go': 'Send request on WhatsApp', 'bk.back': 'Back', 'bk.next': 'Next',
      'bk.sum': 'Your visit', 'bk.l.m': 'Master', 'bk.l.d': 'Day', 'bk.l.t': 'Time', 'bk.l.s': 'Service', 'bk.live': 'live calendar', 'bk.hint': 'Complete the steps and the request goes to the salon’s WhatsApp.',
      'bk.ready': 'All set! Send the request and the salon confirms.', 'bk.demo': 'Demo concept: free/busy slots are an example. On a live site they come from the salon’s own calendar.' },
    ru: { 'bk.s1': 'Мастер', 'bk.s2': 'День', 'bk.s3': 'Время', 'bk.s4': 'Услуга', 'bk.m': 'Выберите мастера', 'bk.d': 'Выберите день', 'bk.t': 'Выберите время', 'bk.s': 'Что делаем?',
      'bk.any': 'Любой мастер', 'bk.anyr': 'Первое свободное кресло', 'bk.free': 'Ближайшее окно', 'bk.today': 'Сегодня', 'bk.tom': 'Завтра', 'bk.closed': 'Выходной', 'bk.none': 'В этот день свободных окон нет',
      'bk.morning': 'Утро', 'bk.noon': 'День', 'bk.eve': 'Вечер', 'bk.free.n': 'св.', 'bk.name': 'Ваше имя (по желанию)', 'bk.go': 'Отправить запись в WhatsApp', 'bk.back': 'Назад', 'bk.next': 'Далее',
      'bk.sum': 'Ваш визит', 'bk.l.m': 'Мастер', 'bk.l.d': 'День', 'bk.l.t': 'Время', 'bk.l.s': 'Услуга', 'bk.live': 'живой календарь', 'bk.hint': 'Пройдите шаги, и запрос уйдёт в WhatsApp салона.',
      'bk.ready': 'Готово! Отправьте запрос, салон подтвердит.', 'bk.demo': 'Демо-концепт: свободные и занятые окна показаны для примера. На рабочем сайте они берутся из календаря салона.' }
  };
  // Every site opens in Turkish; only an explicit ?lang=en|ru in the link overrides it.
  let lang = new URLSearchParams(location.search).get('lang') || 'tr';
  if (!BK[lang]) lang = 'tr';
  const t = k => (TXT[lang] && TXT[lang][k]) || (BK[lang] && BK[lang][k]) || (TXT.tr && TXT.tr[k]) || BK.tr[k] || k;
  const loc = { tr: 'tr-TR', en: 'en-GB', ru: 'ru-RU' };
  const st = { step: 0, master: null, date: null, time: null, service: null, name: '' };

  const pad = n => String(n).padStart(2, '0');
  const iso = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const hash = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0) % 100; };
  const mins = x => { const [h, m] = x.split(':').map(Number); return h * 60 + m; };
  const hm = m => pad(Math.floor(m / 60)) + ':' + pad(m % 60);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function slotsFor(date) {
    const h = S.hours[date.getDay()]; if (!h) return null;
    const out = []; for (let m = mins(h[0]); m + S.step <= mins(h[1]); m += S.step) out.push(m);
    return out;
  }
  function busy(mid, date, m) {
    const now = new Date();
    if (iso(date) === iso(now) && m <= now.getHours() * 60 + now.getMinutes() + 30) return true;
    return hash(S.slug + mid + iso(date) + m) < 38;
  }
  const free = (mid, date, m) => mid === 'any' ? S.masters.some(x => !busy(x.id, date, m)) : !busy(mid, date, m);
  function nextFree(mid) {
    for (let i = 0; i < 14; i++) {
      const d = new Date(); d.setDate(d.getDate() + i); const sl = slotsFor(d); if (!sl) continue;
      const m = sl.find(x => free(mid, d, x)); if (m != null) return { d, m, i };
    }
    return null;
  }
  const dayLabel = (d, i) => i === 0 ? t('bk.today') : i === 1 ? t('bk.tom') : d.toLocaleDateString(loc[lang], { weekday: 'short' });
  const L = o => (o && (o[lang] || o.tr || o.en)) || '';
  const masterObj = id => id === 'any' ? { id: 'any', name: t('bk.any'), role: { tr: t('bk.anyr') }, init: '✦' } : S.masters.find(x => x.id === id);
  const avatar = m => m.photo ? `<span class="bkw-av" style="background-image:url('${m.photo}')"></span>` : `<span class="bkw-av"><b>${m.init}</b></span>`;

  /* ---------- step panes ---------- */
  function paneMaster() {
    return `<h3 class="bkw-h">${t('bk.m')}</h3><div class="bkw-grid m">` + [masterObj('any'), ...S.masters].map(m => {
      const nf = nextFree(m.id);
      return `<button type="button" class="bkw-card${st.master === m.id ? ' on' : ''}" data-act="m" data-v="${m.id}">${avatar(m)}<strong>${esc(m.name)}</strong><span>${esc(L(m.role))}</span>` +
        `<em><i class="pulse"></i>${t('bk.free')}: ${nf ? dayLabel(nf.d, nf.i) + ' ' + hm(nf.m) : t('bk.closed')}</em></button>`;
    }).join('') + '</div>';
  }
  function paneDay() {
    const days = [...Array(14)].map((_, i) => { const d = new Date(); d.setDate(d.getDate() + i); return d; });
    const lead = (days[0].getDay() + 6) % 7, wk = new Date(2024, 0, 1);
    const heads = [...Array(7)].map((_, i) => { const d = new Date(wk); d.setDate(1 + i); return `<span>${d.toLocaleDateString(loc[lang], { weekday: 'short' })}</span>`; }).join('');
    const cells = [...Array(lead)].map(() => '<span class="bkw-blank"></span>').join('') + days.map((d, i) => {
      const closed = !S.hours[d.getDay()], key = iso(d);
      return `<button type="button" class="bkw-day${st.date === key ? ' on' : ''}${i === 0 ? ' today' : ''}" data-act="d" data-v="${key}" ${closed ? 'disabled' : ''}>` +
        `<b>${d.getDate()}</b><small>${closed ? t('bk.closed') : (i < 2 ? dayLabel(d, i) : (d.getDate() === 1 || i === 0 ? d.toLocaleDateString(loc[lang], { month: 'short' }) : ''))}</small></button>`;
    }).join('');
    const mon = days[0].toLocaleDateString(loc[lang], { month: 'long', year: 'numeric' });
    return `<h3 class="bkw-h">${t('bk.d')}<small>${mon}</small></h3><div class="bkw-cal"><div class="bkw-wk">${heads}</div><div class="bkw-days">${cells}</div></div>`;
  }
  function paneTime() {
    const d = new Date(st.date + 'T12:00'), sl = slotsFor(d);
    if (!sl) return `<h3 class="bkw-h">${t('bk.t')}</h3><p class="bkw-empty">${t('bk.closed')}</p>`;
    const grp = [['bk.morning', m => m < 720], ['bk.noon', m => m >= 720 && m < 1020], ['bk.eve', m => m >= 1020]];
    const html = grp.map(([k, f]) => {
      const list = sl.filter(f); if (!list.length) return '';
      const n = list.filter(m => free(st.master, d, m)).length;
      return `<div class="bkw-grp"><div class="bkw-gh"><span>${t(k)}</span><em>${n} ${t('bk.free.n')}</em></div><div class="bkw-slots">` + list.map(m => {
        const f2 = free(st.master, d, m);
        return `<button type="button" class="bkw-slot${st.time === m ? ' on' : ''}" data-act="t" data-v="${m}" ${f2 ? '' : 'disabled'}>${hm(m)}</button>`;
      }).join('') + '</div></div>';
    }).join('');
    const any = sl.some(m => free(st.master, d, m));
    return `<h3 class="bkw-h">${t('bk.t')}<small>${d.toLocaleDateString(loc[lang], { weekday: 'long', day: 'numeric', month: 'long' })}</small></h3>${any ? html : `<p class="bkw-empty">${t('bk.none')}</p>`}`;
  }
  function paneService() {
    return `<h3 class="bkw-h">${t('bk.s')}</h3><div class="bkw-grid s">` + S.services.map((s, i) =>
      `<button type="button" class="bkw-card sv${st.service === s.id ? ' on' : ''}" data-act="s" data-v="${s.id}"><span class="bkw-n">${pad(i + 1)}</span><strong>${t('sv.' + s.id)}</strong></button>`).join('') +
      `</div><label class="bkw-name"><span>${t('bk.name')}</span><input type="text" autocomplete="given-name" value="${esc(st.name)}"></label>`;
  }

  /* ---------- window ---------- */
  function ticket() {
    const m = st.master ? masterObj(st.master) : null;
    const ready = st.master && st.date && st.time != null && st.service;
    const d = st.date ? new Date(st.date + 'T12:00') : null;
    const row = (k, label, val, on) => `<div class="bkw-row${on ? ' on' : ''}"><span>${t(label)}</span><strong>${val || '—'}</strong></div>`;
    return `<div class="bkw-tk"><div class="bkw-tkh"><small>${t('bk.sum')}</small><span class="bkw-bar-p"><i style="width:${[st.master, st.date, st.time != null, st.service].filter(Boolean).length * 25}%"></i></span></div>` +
      row('m', 'bk.l.m', m ? `<span class="bkw-mini">${m.init}</span>${esc(m.name)}` : '', m) +
      row('d', 'bk.l.d', d ? d.toLocaleDateString(loc[lang], { weekday: 'short', day: 'numeric', month: 'long' }) : '', d) +
      row('t', 'bk.l.t', st.time != null ? hm(st.time) : '', st.time != null) +
      row('s', 'bk.l.s', st.service ? t('sv.' + st.service) : '', st.service) +
      `<p class="bkw-hint">${ready ? t('bk.ready') : t('bk.hint')}</p>` +
      `<a class="bkw-go${ready ? '' : ' off'}" href="#" target="_blank" rel="noopener" data-act="go" aria-disabled="${!ready}">${t('bk.go')}</a></div>`;
  }
  function render() {
    const root = document.getElementById('book-ui'); if (!root) return;
    const done = [!!st.master, !!st.date, st.time != null, !!st.service];
    const reach = i => i === 0 || done.slice(0, i).every(Boolean);
    const steps = [1, 2, 3, 4].map((n, i) => `<button type="button" class="bkw-stp${st.step === i ? ' on' : ''}${done[i] ? ' done' : ''}" data-act="go-step" data-v="${i}" ${reach(i) ? '' : 'disabled'}><i>${done[i] && st.step !== i ? '✓' : n}</i><span>${t('bk.s' + n)}</span></button>`).join('<u></u>');
    const pane = [paneMaster, paneDay, paneTime, paneService][st.step]();
    const nextOk = done[st.step] && st.step < 3;
    root.innerHTML = `<div class="bkw"><div class="bkw-bar"><span class="dots"><i></i><i></i><i></i></span><span class="bkw-title">${esc(S.title || 'randevu')} · randevu</span><span class="bkw-live"><i class="pulse"></i>${t('bk.live')}</span></div>` +
      `<div class="bkw-body"><div class="bkw-main"><nav class="bkw-steps">${steps}</nav><div class="bkw-pane" key="${st.step}">${pane}</div>` +
      `<div class="bkw-nav"><button type="button" class="bkw-b" data-act="back" ${st.step === 0 ? 'disabled' : ''}>← ${t('bk.back')}</button>` +
      `<button type="button" class="bkw-b pri" data-act="next" ${nextOk ? '' : 'disabled'}>${t('bk.next')} →</button></div></div>` +
      `<aside class="bkw-side">${ticket()}</aside></div><p class="bkw-demo">${t('bk.demo')}</p></div>`;
  }

  function waLink() {
    const m = st.master === 'any' ? null : S.masters.find(x => x.id === st.master);
    const d = new Date(st.date + 'T12:00');
    const svc = (TXT.tr && TXT.tr['sv.' + st.service]) || st.service;
    const msg = `Merhaba${st.name ? ', ben ' + st.name : ''}! Randevu almak istiyorum: ${svc}, ${m ? m.name + ' ile' : 'fark etmez'}, ` +
      `${d.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })} saat ${hm(st.time)}. Uygun mu?`;
    return 'https://wa.me/' + S.phone + '?text=' + encodeURIComponent(msg);
  }

  document.addEventListener('click', e => {
    const b = e.target.closest('#book-ui [data-act]'); if (!b) return;
    const a = b.dataset.act, v = b.dataset.v;
    if (a === 'go') {
      if (b.classList.contains('off')) { e.preventDefault(); return; }
      b.href = waLink(); return;
    }
    if (a === 'm') { st.master = v; st.time = null; st.step = 1; }
    else if (a === 'd') { st.date = v; st.time = null; st.step = 2; }
    else if (a === 't') { st.time = +v; st.step = 3; }
    else if (a === 's') { st.service = v; }
    else if (a === 'go-step') st.step = +v;
    else if (a === 'back') st.step = Math.max(0, st.step - 1);
    else if (a === 'next') st.step = Math.min(3, st.step + 1);
    render();
  });
  document.addEventListener('input', e => { if (e.target.closest('#book-ui .bkw-name')) { st.name = e.target.value; } });

  function applyLang() {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(e => { const v = t(e.dataset.i18n); if (v !== e.dataset.i18n) e.innerHTML = v; });
    document.querySelectorAll('[data-lang]').forEach(b => b.classList.toggle('on', b.dataset.lang === lang));
    openNow(); render();
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-lang]'); if (!b) return;
    lang = b.dataset.lang; applyLang();
  });

  function openNow() {
    const el = document.querySelectorAll('[data-open]'); if (!el.length) return;
    const n = new Date(), h = S.hours[n.getDay()], cur = n.getHours() * 60 + n.getMinutes();
    const on = h && cur >= mins(h[0]) && cur < mins(h[1]);
    el.forEach(x => { x.dataset.open = on ? '1' : '0'; x.innerHTML = t(on ? 'open.now' : 'open.closed'); });
  }

  function reveal() {
    const items = document.querySelectorAll('.rv');
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches || /static=1/.test(location.search)) { items.forEach(i => i.classList.add('in')); return; }
    const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }), { threshold: .12 });
    items.forEach(i => io.observe(i));
  }
  // the script sits at the end of <body>, so the page is already parsed: apply Turkish before first paint
  applyLang(); reveal();
})();
