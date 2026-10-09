/* piede: il logo nella sua casella. Toccato si rompe: i cinque petali cadono come oggetti veri, ognuno con la sua forma,
   urtano le pareti e si urtano tra loro, si ribaltano e si fermano da soli; poi si torna in Home.
   La fisica è Matter.js (9/10: a mano non veniva naturale), scaricato solo quando si tocca il logo.
   Con "riduci movimento" si va in Home e basta. */
const casella = document.querySelector<HTMLAnchorElement>('.ft-logo');
if (casella && matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  const svg = casella.querySelector('svg')!;
  const petali = [...svg.querySelectorAll<SVGPathElement>('path')];
  let inCorso = false;

  casella.addEventListener('click', async (e) => {
    e.preventDefault();
    if (inCorso) return; inCorso = true;
    const vai = () => { location.href = casella.href; };
    let Matter: typeof import('matter-js'), decomp: any;
    try {
      [Matter, decomp] = await Promise.all([
        import('matter-js').then((m: any) => m.default ?? m),
        import('poly-decomp').then((m: any) => m.default ?? m),
      ]);
    } catch { vai(); return; } // se la libreria non arriva: si va in Home e basta
    const { Engine, Bodies, Body, Composite, Common } = Matter;
    Common.setDecomp(decomp); // per le forme non convesse, come la Λ in basso nel logo

    const C = casella.getBoundingClientRect(), S = svg.getBoundingClientRect();
    const px = S.width / 103, ox = S.left - C.left, oy = S.top - C.top; // dal disegno del logo ai pixel della casella
    const motore = Engine.create({ enableSleeping: true });
    motore.gravity.y = 1.6;

    // le pareti della casella: fondo, lati, soffitto
    const M = 200, muro = { isStatic: true, friction: 0.6 };
    Composite.add(motore.world, [
      Bodies.rectangle(C.width / 2, C.height + M / 2, C.width + 2 * M, M, { ...muro, friction: 0.9 }),
      Bodies.rectangle(-M / 2, C.height / 2, M, C.height + 2 * M, muro),
      Bodies.rectangle(C.width + M / 2, C.height / 2, M, C.height + 2 * M, muro),
      Bodies.rectangle(C.width / 2, -M / 2, C.width + 2 * M, M, muro),
    ]);

    // ogni petalo diventa un corpo con la sua forma vera, nel punto esatto in cui sta nel logo
    const corpi = petali.map((p) => {
      const L = p.getTotalLength();
      const v = Array.from({ length: 44 }, (_, k) => { const q = p.getPointAtLength((L * k) / 44); return { x: ox + q.x * px, y: oy + q.y * px }; });
      const b = Bodies.fromVertices(0, 0, [v], { restitution: 0.3, friction: 0.6, frictionAir: 0.012, density: 0.002 }, true, 0.01, 4);
      const centro = { x: Math.min(...v.map((q) => q.x)) - b.bounds.min.x, y: Math.min(...v.map((q) => q.y)) - b.bounds.min.y };
      Body.setPosition(b, centro);
      p.style.transformBox = 'view-box';
      p.style.transformOrigin = `${(centro.x - ox) / px}px ${(centro.y - oy) / px}px`;
      return { p, b, centro };
    });
    Composite.add(motore.world, corpi.map((k) => k.b));
    // il colpo: un piccolo salto, ognuno un po' verso il suo lato, con un giro
    corpi.forEach(({ b, centro }) => {
      Body.setVelocity(b, { x: (centro.x - C.width / 2) * 0.05 + (Math.random() - 0.5) * 2, y: -4 - Math.random() * 3 });
      Body.setAngularVelocity(b, (Math.random() - 0.5) * 0.24);
    });

    const PASSO = 1000 / 120; // la fisica avanza a passi fissi, qualunque sia lo schermo
    const t0 = performance.now();
    let prima = t0, resto = 0, finito = false;
    const giro = (now: number) => {
      resto += Math.min(50, now - prima); prima = now;
      while (resto >= PASSO) { Engine.update(motore, PASSO); resto -= PASSO; }
      for (const { p, b, centro } of corpi) {
        p.style.transform = `translate(${(b.position.x - centro.x) / px}px, ${(b.position.y - centro.y) / px}px) rotate(${b.angle}rad)`;
      }
      // fermi tutti (o al massimo dopo 3,5 secondi): un momento per guardarli, poi in Home
      if (!finito && (corpi.every((k) => k.b.isSleeping) || now - t0 > 3500)) { finito = true; setTimeout(vai, 350); return; }
      requestAnimationFrame(giro);
    };
    requestAnimationFrame(giro);
  });

  // tornando indietro con il tasto del browser, il logo è di nuovo intero
  addEventListener('pageshow', () => { inCorso = false; petali.forEach((p) => { p.style.transform = ''; }); });
}
