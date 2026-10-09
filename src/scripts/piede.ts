/* piede: il logo nella sua casella. Toccato si rompe: i petali saltano, rimbalzano sulle pareti della casella,
   si posano sul fondo, poi si torna in Home. Con "riduci movimento" si va in Home e basta. */
const casella = document.querySelector<HTMLAnchorElement>('.ft-logo');
if (casella && matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  const svg = casella.querySelector('svg')!;
  const petali = [...svg.querySelectorAll<SVGPathElement>('path')];
  let inCorso = false;

  casella.addEventListener('click', (e) => {
    e.preventDefault();
    if (inCorso) return; inCorso = true;
    const C = casella.getBoundingClientRect();
    const k = 103 / svg.getBoundingClientRect().width; // da pixel dello schermo a unità del disegno
    const G = 2600, MURO = 0.62, TERRA = 0.45; // gravità px/s²; quanta velocità resta dopo un urto
    const centro = { x: C.width / 2, y: C.height / 2 };
    const corpi = petali.map((p, i) => {
      const r = p.getBoundingClientRect();
      const x = r.left - C.left + r.width / 2, y = r.top - C.top + r.height / 2;
      const dx = x - centro.x, dy = y - centro.y, d = Math.hypot(dx, dy) || 1;
      return {
        p, x0: x, y0: y, x, y, hw: r.width / 2, hh: r.height / 2,
        vx: (dx / d) * (260 + Math.random() * 160), vy: -420 - Math.random() * 320 + (dy / d) * 120,
        a: 0, va: (i % 2 ? -1 : 1) * (240 + Math.random() * 200), fermo: false,
      };
    });

    const t0 = performance.now();
    let prima = t0;
    const passo = (now: number) => {
      const dt = Math.min(0.033, (now - prima) / 1000); prima = now;
      for (const c of corpi) {
        if (c.fermo) continue;
        c.vy += G * dt; c.x += c.vx * dt; c.y += c.vy * dt; c.a += c.va * dt;
        const sx = c.hw, dx = C.width - c.hw, su = c.hh, giu = C.height - c.hh;
        if (c.x < sx) { c.x = sx; c.vx = Math.abs(c.vx) * MURO; c.va *= -0.7; }
        if (c.x > dx) { c.x = dx; c.vx = -Math.abs(c.vx) * MURO; c.va *= -0.7; }
        if (c.y < su) { c.y = su; c.vy = Math.abs(c.vy) * MURO; }
        if (c.y > giu) {
          c.y = giu; c.vy = -Math.abs(c.vy) * TERRA; c.vx *= 0.8; c.va *= 0.5;
          if (Math.abs(c.vy) < 60) c.vy = 0; // posato: scivola un poco e si ferma dritto
        }
        if (c.vy === 0 && c.y >= giu) {
          c.vx *= 0.88; c.a *= 0.86; c.va = 0;
          if (Math.abs(c.vx) < 4 && Math.abs(c.a) < 1) { c.fermo = true; c.a = 0; }
        }
        c.p.style.transform = `translate(${(c.x - c.x0) * k}px, ${(c.y - c.y0) * k}px) rotate(${c.a}deg)`;
      }
      const t = (now - t0) / 1000;
      if (corpi.every((c) => c.fermo) || t > 2.4) setTimeout(() => { location.href = casella.href; }, 280);
      else requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
  });

  // tornando indietro con il tasto del browser, il logo è di nuovo intero
  addEventListener('pageshow', () => { inCorso = false; petali.forEach((p) => (p.style.transform = '')); });
}
