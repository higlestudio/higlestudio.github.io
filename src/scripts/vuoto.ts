/* pagina 404: la lingua. Italiano se l'indirizzo era sotto /it/ o il telefono è in italiano. */

const italiano = location.pathname.startsWith('/it/') || /^it\b/i.test(navigator.language || '');
if (italiano) {
  document.documentElement.lang = 'it';
  document.querySelectorAll<HTMLElement>('.vuoto [data-lingua], .vuoto-box [data-lingua]').forEach((el) => { el.hidden = el.dataset.lingua !== 'it'; });
}

/* "Error" / "Errore" larga esattamente quanto il 404 sotto (11/10): si misura e si scala la grandezza del carattere */
const adatta = () => {
  const numero = document.querySelector<HTMLElement>('.vuoto-numero');
  const parola = [...document.querySelectorAll<HTMLElement>('.vuoto-errore')].find((el) => !el.hidden);
  if (!numero || !parola) return;
  parola.style.fontSize = '';
  const scala = numero.getBoundingClientRect().width / parola.getBoundingClientRect().width;
  parola.style.fontSize = `${parseFloat(getComputedStyle(parola).fontSize) * scala}px`;
};
adatta();
document.fonts.ready.then(adatta);
let largo = innerWidth;
addEventListener('resize', () => { if (innerWidth !== largo) { largo = innerWidth; adatta(); } });
