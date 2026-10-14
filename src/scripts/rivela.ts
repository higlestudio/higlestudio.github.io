/* animazioni quando un elemento arriva sullo schermo, senza librerie. Il movimento è tutto in CSS (classi r-* in global.css):
   qui si nascondono gli elementi e si scoprono una volta sola, quando entrano. Niente con "riduci movimento".
   14/10 (Simone): un'animazione sola per tutto il testo, la tendina come le foto, che per il testo scende dall'alto in basso.
   Si muove il blocco intero, il testo non si tocca: a capo e spaziature restano identici (la messa a fuoco parola per parola
   li spostava). In Home, Work, About e sulla descrizione dell'opera; nella pagina opera nome e scheda sono fermi.
   Caricato da Home, Work, About e pagina opera. */

const html = document.documentElement;
const movimento = matchMedia('(prefers-reduced-motion: no-preference)').matches;

// in Home, durante l'ingresso la pagina è nascosta: si parte quando compare
const pronta = () => new Promise<void>((ok) => {
  if (!html.matches('.intro, .intro-resto')) return ok();
  const o = new MutationObserver(() => { if (!html.matches('.intro, .intro-resto')) { o.disconnect(); ok(); } });
  o.observe(html, { attributes: true, attributeFilter: ['class'] });
});

const tutti = <T extends HTMLElement = HTMLElement>(sel: string) => [...document.querySelectorAll<T>(sel)];

// tutto il testo con la tendina: Home (eventi, titolo e testo del progetto), Work (titolo e statement),
// About ("Higle" e bio; Instagram e mail fermi, 14/10), pagina opera (solo la descrizione)
const TESTO = [
  '.evento-t', '.evento-info dt', '.evento-info dd', '.prog-intro h2', '.prog-lead',
  '.st-work .st-titolo', '.statement .lead', '.statement .corpo > *',
  '.me .etichetta', '.me .bio > *',
  '.op-testo > *',
].join(', ');

const avvia = () => {
  if (!movimento) return;

  tutti(TESTO).forEach((el) => el.classList.add('r-scende'));                    // testo: tendina dall'alto in basso
  tutti('.op-foto, .inv-grid .im').forEach((el) => el.classList.add('r-tenda')); // pagina opera e griglia della Home: tendina
  tutti('.opere .foto').forEach((el) => el.classList.add('r-posa'));             // Work: le foto grandi salgono e si posano

  // si scoprono una volta sola, poco prima di arrivare in fondo allo schermo
  const vista = new IntersectionObserver((voci) => voci.forEach((v) => {
    if (!v.isIntersecting) return;
    v.target.classList.add('visto');
    vista.unobserve(v.target);
  }), { rootMargin: '0px 0px -9% 0px' });
  tutti('.r-scende, .r-tenda, .r-posa').forEach((el) => vista.observe(el));
};

document.fonts.ready.then(pronta).then(avvia);
