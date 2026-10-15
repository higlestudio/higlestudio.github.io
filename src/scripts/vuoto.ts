/* pagina 404: la lingua, come nel resto del sito (14/10): prima quella scelta nel piede (ricordata da sito.ts),
   poi l'indirizzo (sotto /it/ = italiano), poi la lingua del telefono. */
import { percorsi, testi } from '../i18n';

let scelta: string | null = null;
try { scelta = localStorage.getItem('higle-lingua'); } catch {}
const italiano = scelta ? scelta === 'it' : location.pathname.startsWith('/it/') || /^it\b/i.test(navigator.language || '');
if (italiano) {
  document.documentElement.lang = 'it';
  document.querySelectorAll<HTMLElement>('.vuoto [data-lingua], .vuoto-box [data-lingua]').forEach((el) => { el.hidden = el.dataset.lingua !== 'it'; });
  piedeInItaliano();
}

/* 14/10: anche il piede in italiano (la pagina è una sola, costruita in inglese). Il menu in alto resta in inglese come ovunque */
function piedeInItaliano() {
  const t = testi.it, p = percorsi.it;
  const $ = <T extends HTMLElement = HTMLElement>(s: string) => document.querySelector<T>(`.ft ${s}`);
  const vai = (s: string, href: string) => { const a = $<HTMLAnchorElement>(s); if (a) a.href = href; };
  vai('.ft-logo', p.home);
  const nav = document.querySelectorAll<HTMLAnchorElement>('.ft-nav a');
  [p.home, p.archivio, p.contatti].forEach((h, i) => { if (nav[i]) nav[i].href = h; });
  const nl = $<HTMLFormElement>('#nl');
  if (nl) Object.assign(nl.dataset, {
    lingua: 'IT', ok: t.nlOk, nonValida: t.nlNonValida, errore: t.nlErrore, spenta: t.nlSpenta,
    nota: `${t.nlNota} ${t.nlNotaLink}${t.nlNotaFine}`,
  });
  const email = $<HTMLInputElement>('#nl-email');
  if (email) email.placeholder = t.tuaEmail;
  const etichetta = $('label[for="nl-email"]'); if (etichetta) etichetta.textContent = t.tuaEmail;
  const bottone = $('#nl button .pl-t'); if (bottone) bottone.textContent = t.iscriviti;
  const nota = $('.nl-nota');
  if (nota) nota.innerHTML = `${t.nlNota} <a href="${p.privacy}">${t.nlNotaLink}</a>${t.nlNotaFine}`;
  const legali = document.querySelectorAll<HTMLAnchorElement>('.ft .legali a');
  if (legali[0]) { legali[0].href = p.privacy; legali[0].textContent = t.privacy; }
  const lingua = $<HTMLAnchorElement>('.lingua');
  if (lingua) { lingua.href = percorsi.en.home; lingua.lang = lingua.hreflang = 'en'; lingua.textContent = testi.it.altraLinguaNome; }
  $('.legali')?.setAttribute('aria-label', t.noteLegali);
  $('.ft-nav')?.setAttribute('aria-label', t.menu);
  $('.ft-icone a[href^="mailto:"]')?.setAttribute('aria-label', t.email);
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
