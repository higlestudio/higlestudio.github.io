const scena = document.querySelector<HTMLElement>('.nuvole');
if (scena) {
  const nuvole = [...scena.querySelectorAll<HTMLElement>('.nv')].map((el) => ({
    el, v: parseFloat(el.style.getPropertyValue('--v')), dx: parseFloat(el.style.getPropertyValue('--dx')),
  }));
  const testo = scena.querySelector<HTMLElement>('.nv-testo')!;
  const calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let alto = innerHeight, largo = innerWidth, corsa = 1, attesa = false;
  const misura = () => { alto = innerHeight; largo = innerWidth; corsa = Math.max(1, scena.offsetHeight - alto); };
  const disegna = () => {
    attesa = false;
    const p = calmo ? 1 : Math.min(1, Math.max(0, -scena.getBoundingClientRect().top / corsa));
    const q = p * p * (3 - 2 * p);
    nuvole.forEach((n) => { n.el.style.transform = `translate3d(${q * n.dx * largo}px, ${-q * n.v * alto}px, 0)`; });
    const t = Math.min(1, Math.max(0, (p - 0.45) / 0.35));
    testo.style.opacity = String(t);
    testo.style.transform = `translate3d(0, ${(1 - t) * 24}px, 0)`;
  };
  const chiedi = () => { if (!attesa) { attesa = true; requestAnimationFrame(disegna); } };
  misura(); disegna();
  addEventListener('scroll', chiedi, { passive: true });

  addEventListener('resize', () => { if (innerWidth !== largo) { misura(); chiedi(); } });
  addEventListener('load', () => { misura(); chiedi(); });

  scena.querySelector<HTMLAnchorElement>('.nv-giu')?.addEventListener('click', (e) => {
    const dove = document.querySelector(scena.querySelector<HTMLAnchorElement>('.nv-giu')!.hash);
    if (!dove) return;
    e.preventDefault();
    dove.scrollIntoView({ behavior: calmo ? 'auto' : 'smooth', block: 'start' });
  });
}
