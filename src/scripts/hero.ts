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

  const ferma = (e: Event) => { if (inCorso) e.preventDefault(); };
  addEventListener('touchmove', ferma, { passive: false });
  addEventListener('wheel', ferma, { passive: false });
  addEventListener('keydown', ferma);

  let finito = false;
  const fine = () => {
    if (finito) return; finito = true;
    velo.classList.add('logo-via');
    setTimeout(() => {
      velo.classList.add('esce');
      setTimeout(() => {
        inCorso = false;
        radice.classList.remove('intro', 'intro-resto');
        velo.remove();
        removeEventListener('touchmove', ferma); removeEventListener('wheel', ferma); removeEventListener('keydown', ferma);
      }, 550);
    }, 450);
  };
  Promise.all(voli.map((a) => a.finished)).then(() => setTimeout(fine, 450), fine);
  setTimeout(fine, 4500);
} else velo?.remove();
