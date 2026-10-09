/* piede: il logo nella sua casella. Toccato si rompe: i petali saltano, rimbalzano sulle pareti della casella,
   si posano sul fondo distesi sul fianco (mai in piedi sulla punta), poi si torna in Home.
   Con "riduci movimento" si va in Home e basta. */
const casella = document.querySelector<HTMLAnchorElement>('.ft-logo');
if (casella && matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  const svg = casella.querySelector('svg')!;
  const petali = [...svg.querySelectorAll<SVGPathElement>('path')];
  let inCorso = false;

  // la forma di ogni petalo come nuvola di punti attorno al suo centro (in pixel), e l'angolo del suo asse lungo
  const forma = (p: SVGPathElement, px: number) => {
    const bb = p.getBBox(), cx = bb.x + bb.width / 2, cy = bb.y + bb.height / 2, L = p.getTotalLength();
    const punti = Array.from({ length: 48 }, (_, i) => { const q = p.getPointAtLength((L * i) / 48); return { x: (q.x - cx) * px, y: (q.y - cy) * px }; });
    let xx = 0, yy = 0, xy = 0;
    punti.forEach((q) => { xx += q.x * q.x; yy += q.y * q.y; xy += q.x * q.y; });
    // il baricentro della forma (non del contorno): serve a scegliere da che parte si corica
    let A = 0, gx = 0, gy = 0;
    punti.forEach((q, i) => { const n = punti[(i + 1) % punti.length], k = q.x * n.y - n.x * q.y; A += k; gx += (q.x + n.x) * k; gy += (q.y + n.y) * k; });
    return { punti, asse: 0.5 * Math.atan2(2 * xy, xx - yy) * 180 / Math.PI, peso: { x: gx / (3 * A), y: gy / (3 * A) } };
  };
  // quanto sporge il petalo, girato di "a" gradi, a sinistra, a destra, in alto e in basso
  const ingombro = (punti: { x: number; y: number }[], a: number) => {
    const r = (a * Math.PI) / 180, co = Math.cos(r), si = Math.sin(r);
    let sx = 0, dx = 0, su = 0, giu = 0;
    for (const q of punti) {
      const x = q.x * co - q.y * si, y = q.x * si + q.y * co;
      sx = Math.min(sx, x); dx = Math.max(dx, x); su = Math.min(su, y); giu = Math.max(giu, y);
    }
    return { sx, dx, su, giu };
  };

  casella.addEventListener('click', (e) => {
    e.preventDefault();
    if (inCorso) return; inCorso = true;
    casella.classList.add('rotto');
    const C = casella.getBoundingClientRect();
    const px = svg.getBoundingClientRect().width / 103; // da unità del disegno a pixel dello schermo
    const G = 2600, MURO = 0.62, TERRA = 0.42; // gravità px/s²; quanta velocità resta dopo un urto
    const centro = { x: C.width / 2, y: C.height / 2 };
    const corpi = petali.map((p, i) => {
      const r = p.getBoundingClientRect();
      const x = r.left - C.left + r.width / 2, y = r.top - C.top + r.height / 2;
      const dx = x - centro.x, dy = y - centro.y, d = Math.hypot(dx, dy) || 1;
      const meta = C.width * ((i * 0.37 + 0.2) % 1); // ognuno salta verso un punto diverso della casella, così non finiscono tutti nello stesso angolo
      return {
        p, ...forma(p, px), x0: x, y0: y, x, y,
        vx: (meta - x) * 2.4 + (Math.random() - 0.5) * 120, vy: -420 - Math.random() * 320 + (dy / d) * 120,
        a: 0, va: (i % 2 ? -1 : 1) * (240 + Math.random() * 200), aTerra: 0, aTerraOk: false, fermo: false,
      };
    });

    // il pavimento sotto un petalo: il fondo della casella, o il petalo già posato su cui sta cadendo
    const pavimento = (c: (typeof corpi)[number], b: ReturnType<typeof ingombro>) => {
      let p = C.height;
      for (const o of corpi) {
        if (o === c || !o.fermo) continue;
        const ob = ingombro(o.punti, o.a), marg = 0.2 * (ob.dx - ob.sx);
        if (c.x + b.dx > o.x + ob.sx + marg && c.x + b.sx < o.x + ob.dx - marg && c.y < o.y) p = Math.min(p, o.y + ob.su + 1);
      }
      return p;
    };
    const t0 = performance.now();
    let prima = t0;
    const passo = (now: number) => {
      const dt = Math.min(0.033, (now - prima) / 1000); prima = now;
      const tardi = (now - t0) / 1000 > 1.5; // dopo un secondo e mezzo chi tocca qualcosa non rimbalza più: si corica e basta
      for (const c of corpi) {
        if (c.fermo) continue;
        c.vy += G * dt; c.x += c.vx * dt; c.y += c.vy * dt; c.a += c.va * dt;
        const b = ingombro(c.punti, c.a);
        if (c.x + b.sx < 0) { c.x = -b.sx; c.vx = Math.abs(c.vx) * MURO; c.va *= -0.7; }
        if (c.x + b.dx > C.width) { c.x = C.width - b.dx; c.vx = -Math.abs(c.vx) * MURO; c.va *= -0.7; }
        if (c.y + b.su < 0) { c.y = -b.su; c.vy = Math.abs(c.vy) * MURO; }
        const terra = pavimento(c, b), aTerra = c.y + b.giu >= terra;
        if (aTerra) {
          c.y = terra - b.giu; c.vy = -Math.abs(c.vy) * TERRA; c.vx *= 0.8; c.va *= 0.5;
          if (Math.abs(c.vy) < 60 || tardi) c.vy = 0;
        }
        if (c.vy === 0 && aTerra) {
          // posato: si corica sul fianco, con l'asse lungo orizzontale, dalla parte più vicina a come è caduto
          if (!c.aTerraOk) {
            // delle due posizioni coricate sceglie quella con il peso più vicino a terra (la Λ in basso nel logo si posa sulle gambe, mai sulla punta)
            const base = -c.asse + Math.round((c.a + c.asse) / 180) * 180;
            const alto = (a: number) => { const r = (a * Math.PI) / 180; return ingombro(c.punti, a).giu - (c.peso.x * Math.sin(r) + c.peso.y * Math.cos(r)); };
            c.aTerra = alto(base) <= alto(base + 180) ? base : base + 180;
            c.aTerraOk = true;
          }
          c.va = 0; c.vx *= tardi ? 0.7 : 0.88;
          c.a += (c.aTerra - c.a) * (tardi ? 0.3 : 0.18);
          c.y = terra - ingombro(c.punti, c.a).giu;
          if (Math.abs(c.vx) < 4 && Math.abs(c.aTerra - c.a) < 0.5) { c.fermo = true; c.a = c.aTerra; c.y = terra - ingombro(c.punti, c.a).giu; }
        }
        c.p.style.transform = `translate(${(c.x - c.x0) / px}px, ${(c.y - c.y0) / px}px) rotate(${c.a}deg)`;
      }
      const t = (now - t0) / 1000;
      if (corpi.every((c) => c.fermo) || t > 3) setTimeout(() => { location.href = casella.href; }, 320);
      else requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
  });

  // tornando indietro con il tasto del browser, il logo è di nuovo intero
  addEventListener('pageshow', () => { inCorso = false; casella.classList.remove('rotto'); petali.forEach((p) => (p.style.transform = '')); });
}
