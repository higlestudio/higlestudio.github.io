/* ogni pagina si apre dall'inizio */
try { history.scrollRestoration = 'manual'; } catch {}
if (!location.hash) { scrollTo(0, 0); addEventListener('pageshow', (e) => { if (e.persisted) scrollTo(0, 0); }); } // al ritorno col tasto indietro; mai a caricamento finito, se intanto si sta già scorrendo

const $ = <T extends Element = HTMLElement>(s: string) => document.querySelector<T>(s);

/* cursore: solo con il mouse */
const puntatore = $('.cur');
if (puntatore && matchMedia('(pointer: fine)').matches) {
  const etichetta = puntatore.querySelector('span')!;
  etichetta.textContent = document.body.dataset.apri || 'Apri';
  let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
  addEventListener('mousemove', (e) => {
    x = e.clientX; y = e.clientY;
    const el = e.target as Element;
    const suOpera = !!el.closest('[data-opera]');
    puntatore.classList.toggle('apri', suOpera);
    puntatore.classList.toggle('link', !suOpera && !!el.closest('a, button'));
    puntatore.classList.toggle('testo', !!el.closest('input'));
  }, { passive: true });
  (function segui() { cx += (x - cx) * 0.22; cy += (y - cy) * 0.22; puntatore.style.transform = `translate(${cx}px, ${cy}px)`; requestAnimationFrame(segui); })();
  document.addEventListener('mouseleave', () => { puntatore.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { puntatore.style.opacity = '1'; });
}


/* il cambio lingua nel piede: si ricorda l'ultima scelta, che si può sempre cambiare di nuovo */
document.querySelectorAll<HTMLAnchorElement>('.lingua').forEach((a) => a.addEventListener('click', () => {
  try { localStorage.setItem('higle-lingua', a.hreflang); } catch {}
}));

/* pagina dell'opera: le foto si sfogliano col dito; i trattini sotto dicono quale si vede e, toccati, ci saltano */
const sfoglia = $('.sfoglia'), trattini = [...document.querySelectorAll<HTMLButtonElement>('.trattini button')];
if (sfoglia && trattini.length > 1) {
  const qui = () => Math.round(sfoglia.scrollLeft / sfoglia.clientWidth);
  const vai = (n: number) => sfoglia.scrollTo({ left: n * sfoglia.clientWidth, behavior: 'smooth' });
  const aggiorna = () => { const n = qui(); trattini.forEach((b, i) => (i === n ? b.setAttribute('aria-current', 'true') : b.removeAttribute('aria-current'))); };
  sfoglia.addEventListener('scroll', aggiorna, { passive: true });
  trattini.forEach((b, i) => b.addEventListener('click', () => vai(i)));
  sfoglia.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') vai(qui() - 1); if (e.key === 'ArrowRight') vai(qui() + 1); });
}

/* Work: un progetto aperto alla volta. Se si chiude quello sopra, la riga appena aperta resta in vista */
// si aprono e si chiudono scorrendo in altezza, così la pagina non cambia misura di colpo
const gruppi = [...document.querySelectorAll<HTMLDetailsElement>('details.gruppo')];
const morbido = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1;
const scorri = (g: HTMLDetailsElement, apri: boolean) => {
  const a = g.querySelector<HTMLElement>('.apre')!;
  a.getAnimations().forEach((x) => x.cancel());
  g.classList.toggle('aperto', apri); // la freccia gira subito, insieme alla griglia
  if (apri) document.dispatchEvent(new CustomEvent('work:aperto', { detail: g }));
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
    if (riga.top < 0) scrollBy({ top: riga.top, behavior: 'smooth' }); // se si è chiuso quello sopra, la riga aperta resta in vista
  };
}));

/* newsletter → Brevo (form "Iscrizione landing IT", lista #3). Si accende prima del lancio, con la privacy pronta. */
const NEWSLETTER_ATTIVA = false;
const BREVO = 'https://32545a85.sibforms.com/serve/MUIFAD67pef7d01AR_c9Gi1IFh9ftt3lvxoTKfBWakwxPV3Z7ATQCNvNPkDrY07CUlfPUn3TC2P7wuYxoAL7YRaALS7AyX10D3bLXF71y795z1-cpFm5a-Qgkz4BShN7omjR2DdilIgsFqm8SC8lFego1adnEShFArCiOzyHeD9M4zUVWJU0o0YWPHMBoSuJGX88xTE5fQyjC5wNrQ==';
const nl = $<HTMLFormElement>('#nl'), esito = $('#nl-ok');
// iPhone: chiusa la tastiera, Safari a volte lascia la pagina spostata con un vuoto sotto il piede; la rimettiamo a posto
// (solo alla chiusura della tastiera e solo se serve: toccare lo scroll mentre si scorre fa tremare la pagina)
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
  body.set('CONSENSO_TESTO', `${new Date().toISOString()} | piede del sito ${location.pathname}`.slice(0, 190));
  body.set('email_address_check', nl.querySelector<HTMLInputElement>('.trappola')!.value);
  let ok = false;
  try {
    const r = await fetch(BREVO, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() });
    const j = await r.json().catch(() => null);
    ok = r.ok && !!j && j.success === true;
  } catch {}
  bottone.disabled = false;
  esito.textContent = ok ? d.ok! : d.errore!;
  if (ok) nl.reset();
});
