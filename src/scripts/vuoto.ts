/* pagina 404: sotto la frase il logo è rotto, i petali staccati e girati. Toccato, si ricompone e si torna in Home.
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
  // ogni petalo si allontana dal centro del logo e gira un po' su se stesso: il logo è rotto, ma si riconosce
  // (in unità del disegno: il logo è largo 103)
  const rotto = [[4, 10, 28], [-14, 3, -34], [12, -10, 22], [13, 6, -26], [-11, -9, 30]];
  if (!calmo) petali.forEach((p, i) => { const [x, y, g] = rotto[i]; p.style.transform = `translate(${x}px, ${y}px) rotate(${g}deg)`; });
  bottone.classList.add('pronti');

  // toccato, si ricompone; poi si torna in Home
  let via = false;
  bottone.addEventListener('click', () => {
    if (via) return; via = true;
    if (calmo) { location.href = home; return; }
    petali.forEach((p, i) => { p.style.transition = `transform .8s cubic-bezier(.2,.8,.2,1) ${i * 0.05}s`; p.style.transform = ''; });
    setTimeout(() => { location.href = home; }, 1150);
  });
}
