/* ingresso della Home (a ogni ricarica e a ogni arrivo da fuori, vedi Home.astro): su nero, i petali arrivano da fuori,
   ognuno dal suo lato, e compongono il logo al centro dello schermo; poi il nero si dissolve e sotto c'è la pagina.
   Toccando si salta. Dal 9/10 il logo grande non resta in Home: dopo l'ingresso si parte dal video. */
const radice = document.documentElement;
const velo = document.querySelector<HTMLElement>('.ingresso');
if (velo && radice.classList.contains('intro')) {
  const svg = velo.querySelector('svg')!;
  const petali = [...svg.querySelectorAll<SVGPathElement>('path')];
  const scala = svg.clientWidth / 103, logo = svg.getBoundingClientRect();
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
  radice.classList.replace('intro', 'intro-resto');
  let inCorso = true;
  const fine = () => {
    if (!inCorso) return; inCorso = false;
    velo.classList.add('esce'); // il nero, col logo, si dissolve
    radice.classList.remove('intro-resto');
    setTimeout(() => velo.remove(), 800);
  };
  Promise.all(voli.map((a) => a.finished)).then(() => setTimeout(fine, 450), fine);
  addEventListener('pointerdown', () => { if (inCorso) { voli.forEach((a) => a.finish()); fine(); } }, { once: true });
} else velo?.remove();
