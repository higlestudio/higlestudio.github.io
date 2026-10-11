/* pagina 404: la lingua. Italiano se l'indirizzo era sotto /it/ o il telefono è in italiano. */

const italiano = location.pathname.startsWith('/it/') || /^it\b/i.test(navigator.language || '');
if (italiano) {
  document.documentElement.lang = 'it';
  document.querySelectorAll<HTMLElement>('.vuoto [data-lingua], .vuoto-box [data-lingua]').forEach((el) => { el.hidden = el.dataset.lingua !== 'it'; });
}
