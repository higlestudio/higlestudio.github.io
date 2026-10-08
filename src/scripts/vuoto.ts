/* pagina 404: i petali del logo sono a terra, appoggiati sopra il menu. Toccandoli si rialzano, ricompongono il logo
   e si torna in Home. La lingua: italiano se l'indirizzo era sotto /it/ o il telefono è in italiano. */

const italiano = location.pathname.startsWith('/it/') || /^it\b/i.test(navigator.language || '');
if (italiano) {
  document.documentElement.lang = 'it';
  document.querySelectorAll<HTMLElement>('.vuoto-testo').forEach((b) => { b.hidden = b.dataset.lingua !== 'it'; });
}
const home = italiano ? '/it/' : '/';

const bottone = document.querySelector<HTMLButtonElement>('.vuoto-petali');
if (bottone) {
  const svg = bottone.querySelector('svg')!;
  const petali = [...svg.querySelectorAll<SVGPathElement>('path')];
  const calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const giri = [96, -128, 152, -74, 118], posti = [0.13, 0.32, 0.5, 0.68, 0.87]; // rotazione e punto a terra di ogni petalo

  // ogni petalo va a terra: appoggiato sopra il menu, sparso in larghezza, girato a modo suo
  const atterra = () => {
    petali.forEach((p) => { p.style.transition = 'none'; p.style.transform = ''; });
    if (calmo) return;
    const menu = document.querySelector('.pill-nav')?.getBoundingClientRect();
    const terra = (menu ? menu.top : innerHeight) - 14 + scrollY;
    const scala = svg.getBoundingClientRect().width / 103;
    petali.forEach((p, i) => {
      const r = p.getBoundingClientRect();
      const dx = innerWidth * posti[i] - (r.left + r.width / 2);
      const dy = terra - (r.top + scrollY + r.height / 2) - Math.max(r.width, r.height) * 0.5; // tutto il petalo sta sopra il menu, comunque sia girato
      p.style.transform = `translate(${dx / scala}px, ${dy / scala}px) rotate(${giri[i]}deg)`;
    });
  };
  atterra();
  bottone.classList.add('pronti');
  let largo = innerWidth;
  addEventListener('resize', () => { if (innerWidth !== largo) { largo = innerWidth; atterra(); } });

  // toccati, si rialzano e ricompongono il logo; poi si torna in Home
  let via = false;
  bottone.addEventListener('click', () => {
    if (via) return; via = true;
    if (calmo) { location.href = home; return; }
    petali.forEach((p, i) => { p.style.transition = `transform .9s cubic-bezier(.2,.8,.2,1) ${i * 0.06}s`; p.style.transform = ''; });
    setTimeout(() => { location.href = home; }, 1350);
  });
}
