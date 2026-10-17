/* animazioni quando un elemento arriva sullo schermo, senza librerie. Il movimento è tutto in CSS (classi r-* in global.css):
   qui si nascondono gli elementi e si scoprono una volta sola, quando entrano. Niente con "riduci movimento".
   14/10 (Simone): un'animazione sola per tutto il testo, la tendina come le foto, che per il testo scende dall'alto in basso.
   Si muove il blocco intero, il testo non si tocca: a capo e spaziature restano identici (la messa a fuoco parola per parola
   li spostava). In Home, Work, About e sulla descrizione dell'opera; nella pagina opera nome e scheda sono fermi.
   Caricato su ogni pagina insieme a sito.ts (14/10: un file solo invece di quattro): dove non c'è niente da animare non fa niente. */

const html = document.documentElement;
const movimento = matchMedia('(prefers-reduced-motion: no-preference)').matches;

// in Home, durante l'ingresso la pagina è nascosta: si parte quando compare
const pronta = () => new Promise<void>((ok) => {
  if (!html.matches('.intro, .intro-resto')) return ok();
  const o = new MutationObserver(() => { if (!html.matches('.intro, .intro-resto')) { o.disconnect(); ok(); } });
  o.observe(html, { attributes: true, attributeFilter: ['class'] });
});

const tutti = <T extends HTMLElement = HTMLElement>(sel: string) => [...document.querySelectorAll<T>(sel)];

// tutto il testo con la tendina: Home (titolo e testo del progetto; gli eventi fermi), Work (titolo e statement),
// About (solo la bio; Instagram e mail fermi, 14/10), pagina opera (solo la descrizione)
const TESTO = [
  '.prog-intro h2', '.prog-lead',
  '.st-work .st-titolo', '.statement .lead', '.statement .corpo > *',
  '.me .bio > *',
  '.op-testo > *',
].join(', ');

// 17/10: una foto si scopre solo quando è pronta. Le foto si caricano avvicinandosi, e sono grandi (2400 px): se la tendina
// partiva subito scopriva il riquadro col fondo chiaro e la foto arrivava dopo, di colpo. Si aspetta la foto che si vede
// (nella galleria dell'opera solo quella al centro, non le copie); con una rete lentissima dopo 4 s si apre comunque
const fotoPronta = (el: Element) => {
  const box = el.getBoundingClientRect();
  const foto = [...el.querySelectorAll('img')].filter((i) => { const r = i.getBoundingClientRect(); return r.right > box.left + 1 && r.left < box.right - 1; });
  if (foto.every((i) => i.complete && i.naturalWidth)) return Promise.resolve();
  return Promise.race([
    Promise.all(foto.map((i) => i.decode().catch(() => {}))),
    new Promise((ok) => setTimeout(ok, 4000)),
  ]);
};

const avvia = () => {
  if (!movimento) return;

  tutti(TESTO).forEach((el) => el.classList.add('r-scende'));                    // testo: tendina dall'alto in basso
  tutti('.op-foto, .inv-grid .im, .opere .foto').forEach((el) => el.classList.add('r-tenda')); // foto: tendina ovunque (Work come la Home, 14/10)

  // le foto si scaricano già a uno schermo e mezzo di distanza (Safari da solo aspetta troppo): arrivandoci, di solito sono pronte
  const vicino = new IntersectionObserver((voci) => voci.forEach((v) => {
    if (!v.isIntersecting) return;
    v.target.querySelectorAll('img').forEach((i) => { i.loading = 'eager'; });
    vicino.unobserve(v.target);
  }), { rootMargin: '0px 0px 150% 0px' });
  tutti('.r-tenda').forEach((el) => vicino.observe(el));

  // si scoprono una volta sola, poco prima di arrivare in fondo allo schermo
  const vista = new IntersectionObserver((voci) => voci.forEach((v) => {
    if (!v.isIntersecting) return;
    vista.unobserve(v.target);
    if (v.target.classList.contains('r-tenda')) fotoPronta(v.target).then(() => v.target.classList.add('visto')); // la foto, quando è pronta
    else v.target.classList.add('visto');
  }), { rootMargin: '0px 0px -9% 0px' });
  tutti('.r-scende, .r-tenda').forEach((el) => vista.observe(el));
};

document.fonts.ready.then(pronta).then(avvia);
