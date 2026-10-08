/* hero: il logo grande; toccando ovunque i petali cadono, rimbalzano sul bordo basso dello schermo ed escono */
const hero = document.querySelector<HTMLElement>('.hero2');
if (hero) {
  const box = hero.querySelector<HTMLElement>('.marchio2')!;
  const btn = hero.querySelector<HTMLButtonElement>('.mk-btn')!;
  const petali = [...btn.querySelectorAll<SVGPathElement>('path')];
  const calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SOPRA = 28, SOTTO = 28; // aria intorno al logo

  // la fascia è alta quanto il logo, non quanto lo schermo
  const piazza = () => {
    const W = hero.clientWidth;
    const w = Math.min(W * (W < 600 ? 0.86 : 0.5), 760), h = (w * 80) / 103;
    hero.style.height = `${h + SOPRA + SOTTO}px`;
    Object.assign(box.style, { width: `${w}px`, height: `${h}px`, left: `${(W - w) / 2}px`, top: `${SOPRA}px` });
  };
  // solo quando cambia la larghezza: su iPhone la barra di Safari cambia l'altezza a ogni scorrimento
  let largo = innerWidth;
  piazza(); addEventListener('resize', () => { if (innerWidth !== largo) { largo = innerWidth; piazza(); } });
  let caduto = false, finito = false, guida = false, bloccato = 0;
  const morbido = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const mostra = (si: boolean, lento = false) => petali.forEach((p) => { p.style.transition = lento ? 'opacity .6s ease' : 'none'; p.style.opacity = si ? '1' : '0'; });
  const ricomponi = () => { caduto = false; finito = false; hero.classList.remove('rotto'); mostra(true, true); };

  // ingresso, solo alla prima apertura della visita: la caduta al contrario. I petali arrivano da fuori, ognuno dal suo lato,
  // e compongono il logo; poi compaiono menu e pagina. Toccando si salta.
  const html = document.documentElement;
  if (html.classList.contains('intro')) {
    try { sessionStorage.setItem('higle-intro', '1'); } catch {}
    btn.style.transition = 'none'; btn.classList.add('vis');
    const scala = btn.clientWidth / 103, logo = btn.getBoundingClientRect();
    const cx = logo.left + logo.width / 2, cy = logo.top + logo.height / 2, lontano = Math.hypot(innerWidth, innerHeight);
    const voli = petali.map((p, i) => {
      const r = p.getBoundingClientRect();
      const dx = r.left + r.width / 2 - cx, dy = r.top + r.height / 2 - cy, d = Math.hypot(dx, dy) || 1;
      const giro = (i % 2 ? -1 : 1) * (220 + i * 40);
      return p.animate(
        [{ transform: `translate(${(dx / d) * lontano / scala}px, ${(dy / d) * lontano / scala}px) rotate(${giro}deg)` }, { transform: 'none' }],
        { duration: 950, delay: 120 + i * 90, easing: 'cubic-bezier(.16,1.18,.4,1)', fill: 'backwards' },
      );
    });
    html.classList.replace('intro', 'intro-resto');
    let inCorso = true;
    const fine = () => { inCorso = false; html.classList.remove('intro-resto'); };
    Promise.all(voli.map((a) => a.finished)).then(fine, fine);
    addEventListener('pointerdown', () => { if (inCorso) { voli.forEach((a) => a.finish()); bloccato = performance.now() + 500; } }, { once: true });
  } else requestAnimationFrame(() => btn.classList.add('vis'));

  // spinto = la pagina che sale col dito schiaccia il logo: i petali partono verso il basso e lo scorrimento resta di chi scorre
  const cadi = (spinto = false) => {
    if (caduto || performance.now() < bloccato) return; caduto = true; guida = !spinto; hero.classList.add("rotto");
    const titolo = document.querySelector('.ciclo2')!; // dove comincia il progetto: le opere
    const testa = parseFloat(getComputedStyle(document.body).paddingTop) || 0; // si ferma sotto il menu, che sta in alto
    const da = scrollY, corsa = titolo.getBoundingClientRect().top + scrollY - testa - da;

    if (calmo) { mostra(false, true); scrollTo(0, da + corsa); finito = true; return; }

    // i petali escono dalla pagina e volano sullo schermo: lo scorrimento non li tocca più
    const volo = document.createElement('div');
    volo.className = 'volo'; volo.setAttribute('aria-hidden', 'true');
    document.body.append(volo);
    // il pavimento è il bordo basso dello schermo (dal 8/10 il menu sta in alto): i petali ci battono nella parte centrale
    const m = { left: innerWidth * 0.15, right: innerWidth * 0.85, width: innerWidth * 0.7 };
    const pavimento = innerHeight - 4;
    const G = 2200; // gravità, px/s²
    const corpi = petali.map((p, i) => {
      const r = p.getBoundingClientRect(), bb = p.getBBox();
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', `${bb.x} ${bb.y} ${bb.width} ${bb.height}`);
      Object.assign(svg.style, { width: `${r.width}px`, height: `${r.height}px` });
      svg.append(p.cloneNode(true));
      volo.append(svg);
      const x = r.left + r.width / 2, y = r.top + r.height / 2;
      svg.style.transform = `translate(${r.left}px, ${r.top}px)`; // parte esattamente da dove sta nel logo, anche mentre aspetta il suo turno
      // ognuno punta a un punto del pavimento, così tutti ci rimbalzano sopra
      const meta = m.left + m.width * (0.15 + 0.7 * ((i * 0.37 + 0.2) % 1));
      const vy0 = spinto ? 160 + i * 40 : -260 - i * 30, dy = Math.max(40, pavimento - (y + r.height * 0.35));
      const t = (-vy0 + Math.sqrt(vy0 * vy0 + 2 * G * dy)) / G;
      return { el: svg, x, y, w: r.width, h: r.height, vx: (meta - x) / t, vy: vy0, a: 0, va: (i % 2 ? -1 : 1) * (160 + i * 40), parte: i * 0.05, rimbalzato: false, fuori: false };
    });
    mostra(false);

    const t0 = performance.now();
    let prima = t0;
    const passo = (now: number) => {
      const dt = Math.min(0.033, (now - prima) / 1000); prima = now;
      const t = (now - t0) / 1000;
      if (guida) scrollTo(0, da + corsa * morbido(Math.min(1, t / 1.6)));
      for (const c of corpi) {
        if (c.fuori || t < c.parte) continue;
        c.vy += G * dt; c.x += c.vx * dt; c.y += c.vy * dt; c.a += c.va * dt;
        // il primo tocco sul pavimento: rimbalzo, poi via verso il lato da cui è arrivato
        if (!c.rimbalzato && c.vy > 0 && c.y + c.h * 0.35 >= pavimento) {
          c.rimbalzato = true;
          c.y = pavimento - c.h * 0.35;
          c.vy = -Math.min(c.vy * 0.55, 900);
          const lato = c.x < m.left + m.width / 2 ? -1 : 1;
          c.vx = lato * (220 + Math.random() * 260);
          c.va *= -2.2;
        }
        if (c.y - c.h > innerHeight || c.x + c.w < -40 || c.x - c.w > innerWidth + 40) { c.fuori = true; c.el.remove(); continue; }
        c.el.style.transform = `translate(${c.x - c.w / 2}px, ${c.y - c.h / 2}px) rotate(${c.a}deg)`;
      }
      if (corpi.some((c) => !c.fuori) || t < 1.6) requestAnimationFrame(passo);
      else { volo.remove(); finito = true; guida = false; }
    };
    requestAnimationFrame(passo);
  };

  // si tocca ovunque, finché non si è scesi oltre il titolo; link, pulsanti e campi fanno il loro lavoro
  btn.addEventListener('click', () => cadi());
  document.addEventListener('click', (e) => {
    const el = e.target as Element;
    if (el.closest('a, button, input, label, select, textarea')) return;
    if (scrollY >= document.querySelector('.ciclo2')!.getBoundingClientRect().top + scrollY - 4) return;
    cadi();
  });

  // durante la caduta: appena il dito (o la rotella) prende la pagina, il sito smette di guidarla
  const molla = () => { guida = false; };
  addEventListener('touchstart', molla, { passive: true });
  addEventListener('wheel', molla, { passive: true });
  addEventListener('keydown', molla);

  // tornando in cima il logo si ricompone; scorrendo dalla cima senza toccarlo, il bordo dello schermo lo schiaccia e lo rompe (non durante l'ingresso)
  addEventListener('scroll', () => {
    if (finito && scrollY < 10) { ricomponi(); return; }
    if (!caduto && scrollY > 6 && scrollY < hero.offsetHeight && !html.matches('.intro, .intro-resto')) cadi(true);
  }, { passive: true });
}
