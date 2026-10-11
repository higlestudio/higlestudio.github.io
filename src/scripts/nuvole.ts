/* Home, in cima: le nuvole (componenti/Nuvole.astro). La scena resta ferma sullo schermo mentre si scorre la sua altezza;
   intanto ogni nuvola sale alla sua velocità (--v schermi) e scivola un po' di lato (--dx), e sotto compare il testo.
   Solo trasformazioni, aggiornate a ogni fotogramma di scorrimento: niente scrollTo (vedi trappole di Safari). */
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
    const p = calmo ? 1 : Math.min(1, Math.max(0, -scena.getBoundingClientRect().top / corsa)); // 0 in cima, 1 a fine scena
    const q = p * p * (3 - 2 * p); // parte e arriva morbida
    nuvole.forEach((n) => { n.el.style.transform = `translate3d(${q * n.dx * largo}px, ${-q * n.v * alto}px, 0)`; });
    const t = Math.min(1, Math.max(0, (p - 0.12) / 0.45)); // il testo compare mentre le nuvole si aprono
    testo.style.opacity = String(0.2 + 0.8 * t); // si intravede già fra le nuvole
    testo.style.transform = `translate3d(0, ${(1 - t) * 24}px, 0)`;
  };
  const chiedi = () => { if (!attesa) { attesa = true; requestAnimationFrame(disegna); } };
  misura(); disegna();
  addEventListener('scroll', chiedi, { passive: true });
  // solo se cambia la larghezza: la barra di Safari cambia l'altezza a ogni scorrimento
  addEventListener('resize', () => { if (innerWidth !== largo) { misura(); chiedi(); } });
  addEventListener('load', () => { misura(); chiedi(); });

  // la freccia: giù fino alle opere, scorrendo
  scena.querySelector<HTMLAnchorElement>('.nv-giu')?.addEventListener('click', (e) => {
    const dove = document.querySelector(scena.querySelector<HTMLAnchorElement>('.nv-giu')!.hash);
    if (!dove) return;
    e.preventDefault();
    dove.scrollIntoView({ behavior: calmo ? 'auto' : 'smooth', block: 'start' });
  });
}
