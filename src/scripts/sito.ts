try { history.scrollRestoration = 'manual'; } catch {}
if (!location.hash) { scrollTo(0, 0); addEventListener('pageshow', (e) => { if (e.persisted) scrollTo(0, 0); }); }

const $ = <T extends Element = HTMLElement>(s: string) => document.querySelector<T>(s);

const puntatore = $('.cur');
if (puntatore && matchMedia('(pointer: fine)').matches) {
  let x = 0, y = 0, attesa = false;
  const disegna = () => { attesa = false; puntatore.style.translate = `${x}px ${y}px`; };
  addEventListener('mousemove', (e) => {
    x = e.clientX; y = e.clientY;
    if (!attesa) { attesa = true; requestAnimationFrame(disegna); }
    const el = e.target as Element;
    const suOpera = !!el.closest('[data-opera]');
    const suFoto = !!el.closest('.sfoglia[tabindex]');
    puntatore.classList.add('vivo');
    puntatore.classList.toggle('apri', suOpera || suFoto);
    puntatore.classList.toggle('frecce', suFoto);
    puntatore.classList.toggle('link', !suOpera && !!el.closest('a, button, summary'));
    puntatore.classList.toggle('testo', !!el.closest('input'));
    puntatore.classList.toggle('chiaro', !suOpera && !suFoto && !!el.closest('.pn-group, .scopri-pillola a, .nl button'));
  }, { passive: true });
  document.addEventListener('mouseleave', () => puntatore.classList.remove('vivo'));
}

document.querySelectorAll<HTMLAnchorElement>('.lingua').forEach((a) => a.addEventListener('click', () => {
  try { localStorage.setItem('higle-lingua', a.hreflang); } catch {}
}));

const sfoglia = $('.sfoglia'), trattini = [...document.querySelectorAll<HTMLButtonElement>('.trattini button')];

if (sfoglia && trattini.length > 1) {
  const n = trattini.length;
  const vere = [...sfoglia.querySelectorAll('img')];
  const copia = (img: HTMLImageElement) => { const c = img.cloneNode() as HTMLImageElement; c.alt = ''; c.setAttribute('aria-hidden', 'true'); c.loading = 'eager'; return c; };

  const giri = Math.ceil(6 / n), centro = giri * n;
  for (let g = 0; g < giri; g++) { sfoglia.prepend(...vere.map(copia)); sfoglia.append(...vere.map(copia)); }
  const w = () => sfoglia.clientWidth;
  const salta = (i: number) => { sfoglia.style.scrollSnapType = 'none'; sfoglia.scrollLeft = i * w(); void sfoglia.offsetWidth; sfoglia.style.scrollSnapType = ''; };
  salta(centro);
  const qui = () => Math.round(sfoglia.scrollLeft / w());
  const scorri = (i: number) => sfoglia.scrollTo({ left: i * w(), behavior: 'smooth' });
  const vai = (k: number) => scorri(centro + k);
  const aggiorna = () => {
    const vera = qui() % n;
    trattini.forEach((b, i) => (i === vera ? b.setAttribute('aria-current', 'true') : b.removeAttribute('aria-current')));
  };

  let ferma = 0, dito = false;
  let meta: number | null = null;
  const fermo = () => {
    if (!dito && sfoglia.classList.contains('lasciata')) { sfoglia.classList.remove('lasciata'); sfoglia.style.scrollSnapType = ''; }
    const i = qui();
    if (dito || Math.abs(sfoglia.scrollLeft - i * w()) > 8) return;
    salta(i < centro || i >= centro + n ? centro + (i % n) : i);
    meta = null;
    aggiorna();
  };
  const aspetta = () => { clearTimeout(ferma); ferma = setTimeout(fermo, 120); };
  sfoglia.addEventListener('scroll', () => { aggiorna(); aspetta(); }, { passive: true });
  sfoglia.addEventListener('touchstart', () => { dito = true; }, { passive: true });
  sfoglia.addEventListener('touchend', () => { dito = false; aspetta(); }, { passive: true });
  sfoglia.addEventListener('touchcancel', () => { dito = false; aspetta(); }, { passive: true });
  trattini.forEach((b, i) => b.addEventListener('click', () => vai(i)));

  sfoglia.querySelectorAll('img').forEach((img) => { img.draggable = false; });
  let presa: { x: number; da: number; i: number } | null = null;
  sfoglia.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    presa = { x: e.clientX, da: sfoglia.scrollLeft, i: meta ?? qui() };
    dito = true; sfoglia.style.scrollSnapType = 'none'; sfoglia.classList.add('trascina');
    sfoglia.setPointerCapture(e.pointerId);
  });
  sfoglia.addEventListener('pointermove', (e) => { if (presa) sfoglia.scrollLeft = presa.da - (e.clientX - presa.x); });
  const lascia = (e: PointerEvent) => {
    if (!presa) return;
    const tratto = e.clientX - presa.x, i = presa.i;
    presa = null; dito = false; sfoglia.classList.remove('trascina'); sfoglia.classList.add('lasciata');
    const dove = Math.abs(tratto) > w() / 10 ? i - Math.sign(tratto) : i;
    meta = dove;
    sfoglia.scrollTo({ left: dove * w(), behavior: 'smooth' });
    aspetta();
  };
  sfoglia.addEventListener('pointerup', lascia);
  sfoglia.addEventListener('pointercancel', lascia);
  sfoglia.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') scorri(qui() - 1); if (e.key === 'ArrowRight') scorri(qui() + 1); });

  let gesto = 0;
  sfoglia.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || Math.abs(e.deltaX) < 12) return;
    e.preventDefault();
    if (performance.now() - gesto < 650) return;
    gesto = performance.now();
    scorri(qui() + Math.sign(e.deltaX));
  }, { passive: false });
  let largo = innerWidth;
  addEventListener('resize', () => { if (innerWidth !== largo) { largo = innerWidth; salta(qui()); } });
}

const gruppi = [...document.querySelectorAll<HTMLDetailsElement>('details.gruppo')];
const morbido = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1;
const scorri = (g: HTMLDetailsElement, apri: boolean) => {
  const a = g.querySelector<HTMLElement>('.apre')!;
  a.getAnimations().forEach((x) => x.cancel());
  g.classList.toggle('aperto', apri);
  if (apri) g.open = true;
  const h = a.scrollHeight;
  const anim = a.animate(
    [{ height: `${apri ? 0 : h}px`, opacity: apri ? 0 : 1 }, { height: `${apri ? h : 0}px`, opacity: apri ? 1 : 0 }],
    { duration: (apri ? 480 : 360) * morbido, easing: 'cubic-bezier(.2,.8,.2,1)' },
  );
  a.style.overflow = 'hidden';
  anim.onfinish = () => { a.style.overflow = ''; if (!apri) g.open = false; };
  return anim;
};
gruppi.forEach((g) => g.querySelector('summary')!.addEventListener('click', (e) => {
  e.preventDefault();
  if (g.open) { scorri(g, false); return; }
  const aperti = gruppi.filter((x) => x !== g && x.open);
  aperti.forEach((x) => scorri(x, false));
  scorri(g, true).onfinish = () => {
    g.querySelector<HTMLElement>('.apre')!.style.overflow = '';
    const riga = g.querySelector('summary')!.getBoundingClientRect();
    if (riga.top < 0) scrollBy({ top: riga.top, behavior: 'smooth' });
  };
}));

const NEWSLETTER_ATTIVA = true;
const BREVO: Record<string, string> = {
  IT: 'https://32545a85.sibforms.com/serve/MUIFAPoLPrbdDc1Kv3wUoeblhc_HSTXsF3_JiqczjW5CBF0UlCihVtaKIG1RLWk7TH0IfmR32fB143ARJzKE6CNdeaA1ricTAGXcTM01ZHd1hFMyhpSNutQXOFYNBbb6byZr3ykqWB3nubQSTWp6yo34WnGeWIZ9dRmTgqdE0zim5vgk2MSJCEWEsMN1Y5LKsZAmHQfm5Q-WxNOrxQ==',
  EN: 'https://32545a85.sibforms.com/serve/MUIFAMYfEFi1V37iatGErWasY4aZMSc_rjAHgRVZKUqK-WdsFud93_z0zV-CAd0ke9w92yOSbvlY45fzodNXoS2GKVi_P6FzCMFk4ZGRsXy15AWdhhe_NeuR00mEfA9ArOzdgBOKJkLFL-iolTJW7tSQ-62DjMLtPQwRs7S7UHA6zewJuikjY9zRLmVzdaH1DPqTjDnS_rFsqjLopQ==',
};
const nl = $<HTMLFormElement>('#nl'), esito = $('#nl-ok');

nl?.querySelector('#nl-email')?.addEventListener('blur', () => {
  setTimeout(() => {
    const fine = document.documentElement.scrollHeight - innerHeight;
    if (!document.activeElement?.matches('input') && scrollY > fine + 1) scrollTo(scrollX, fine);
  }, 150);
});
if (nl && esito) nl.addEventListener('submit', async (e) => {
  e.preventDefault();
  const d = nl.dataset;
  const email = (nl.querySelector<HTMLInputElement>('#nl-email')!.value || '').trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { esito.textContent = d.nonValida!; return; }
  if (!NEWSLETTER_ATTIVA) { esito.textContent = d.spenta!; return; }
  const bottone = nl.querySelector('button')!; bottone.disabled = true;
  const body = new URLSearchParams();
  body.set('EMAIL', email);
  body.set('LINGUA', d.lingua!);
  body.set('locale', d.lingua!.toLowerCase());

  body.set('CONSENSO_TESTO', `${new Date().toISOString()} | ${d.nota} | ${location.pathname}`.slice(0, 190));
  body.set('email_address_check', nl.querySelector<HTMLInputElement>('.trappola')!.value);
  let ok = false;
  try {
    const r = await fetch(BREVO[d.lingua!] ?? BREVO.EN, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() });
    const j = await r.json().catch(() => null);
    ok = r.ok && !!j && j.success === true;
  } catch {}
  bottone.disabled = false;
  esito.textContent = ok ? d.ok! : d.errore!;
  if (ok) nl.reset();
});

document.querySelectorAll<HTMLButtonElement>('.evento-apri').forEach((b) => b.addEventListener('click', () => {
  const aperto = b.closest('.evento')!.classList.toggle('aperto');
  b.setAttribute('aria-expanded', String(aperto));
}));
