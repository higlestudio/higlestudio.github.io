/* pagina 404: i petali del logo sono caduti sulla linea del piede. Toccati, si rialzano, ricompongono il logo e si torna in Home.
   La lingua: italiano se l'indirizzo era sotto /it/ o il telefono è in italiano. */

const italiano = location.pathname.startsWith('/it/') || /^it\b/i.test(navigator.language || '');
if (italiano) {
  document.documentElement.lang = 'it';
  document.querySelectorAll<HTMLElement>('.vuoto-frase').forEach((p) => { p.hidden = p.dataset.lingua !== 'it'; });
}
const home = italiano ? '/it/' : '/';

const bottone = document.querySelector<HTMLButtonElement>('.vuoto-petali');
if (bottone) {
  const petali = [...bottone.querySelectorAll<SVGPathElement>('path')];
  const calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const giri = [96, -128, 152, -74, 118], posti = [0.13, 0.32, 0.5, 0.68, 0.87]; // rotazione e punto a terra di ogni petalo

  // i petali sono caduti: a terra sulla linea dove comincia il piede, sparsi in larghezza, ognuno girato a modo suo
  const atterra = () => {
    petali.forEach((p) => { p.style.transition = 'none'; p.style.transform = ''; });
    if (calmo) return;
    const piede = document.querySelector('.ft');
    if (!piede) return;
    const terra = piede.getBoundingClientRect().top + scrollY;
    const scala = bottone.getBoundingClientRect().width / 103;
    petali.forEach((p, i) => {
      const r = p.getBoundingClientRect();
      const dx = innerWidth * posti[i] - (r.left + r.width / 2);
      let dy = terra - (r.top + scrollY + r.height / 2);
      p.style.transform = `translate(${dx / scala}px, ${dy / scala}px) rotate(${giri[i]}deg)`;
      // girato occupa più spazio: si misura e lo si alza finché il punto più basso tocca la linea
      dy += terra - (p.getBoundingClientRect().bottom + scrollY);
      p.style.transform = `translate(${dx / scala}px, ${dy / scala}px) rotate(${giri[i]}deg)`;
    });
  };
  atterra();
  bottone.classList.add('pronti');
  let largo = innerWidth;
  addEventListener('resize', () => { if (innerWidth !== largo) { largo = innerWidth; atterra(); } });

  // toccato, si ricompone; poi si torna in Home
  let via = false;
  bottone.addEventListener('click', () => {
    if (via) return; via = true;
    if (calmo) { location.href = home; return; }
    petali.forEach((p, i) => { p.style.transition = `transform .8s cubic-bezier(.2,.8,.2,1) ${i * 0.05}s`; p.style.transform = ''; });
    setTimeout(() => { location.href = home; }, 1150);
  });
}
