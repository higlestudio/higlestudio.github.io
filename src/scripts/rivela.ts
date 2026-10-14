/* animazioni quando un elemento arriva sullo schermo, senza librerie. Il movimento è tutto in CSS (classi r-* in global.css):
   qui si nascondono gli elementi e si scoprono una volta sola, quando entrano. Niente con "riduci movimento".
   14/10 (Simone): un'animazione sola per tutto il testo, la messa a fuoco parola per parola, in Home, Work, About e
   sulla descrizione dell'opera; nella pagina opera il resto del testo (nome, scheda) è fermo. Le foto restano come prima.
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
const ritardo = (el: HTMLElement, s: number) => el.style.setProperty('--ritardo', `${s}s`);

// ogni parola nella sua scatolina, che si mette a fuoco da sola. Si lavora sui soli nodi di testo,
// così grassetti, corsivi e link restano dove sono
const parole = (p: HTMLElement) => {
  const nodi: Text[] = [];
  const giro = document.createTreeWalker(p, NodeFilter.SHOW_TEXT);
  while (giro.nextNode()) nodi.push(giro.currentNode as Text);
  nodi.forEach((n) => {
    const f = document.createDocumentFragment();
    n.data.split(/(\s+)/).filter(Boolean).forEach((x) => {
      if (/^\s+$/.test(x)) { f.append(x); return; }
      const w = document.createElement('span');
      w.className = 'r-p'; w.textContent = x; f.append(w);
    });
    n.replaceWith(f);
  });
  // in ordine di lettura: tutto il blocco entra in circa un secondo, mai più lento di una parola ogni 0,04 s
  const w = p.querySelectorAll<HTMLElement>('.r-p');
  const passo = Math.min(0.04, 1 / Math.max(1, w.length));
  w.forEach((x, i) => ritardo(x, i * passo));
  p.classList.add('r-fuoco');
};

// tutto il testo che si mette a fuoco: Home (eventi, titolo e testo del progetto), Work (titolo e statement),
// About (contatti e bio), pagina opera (solo la descrizione)
const TESTO = [
  '.evento-t', '.evento-info dt', '.evento-info dd', '.prog-intro h2', '.prog-lead',
  '.st-work .st-titolo', '.statement .lead', '.statement .corpo > *',
  '.me .ft-ig span', '.me .etichetta', '.me .bio > *',
  '.op-testo > *',
].join(', ');

const avvia = () => {
  if (!movimento) return;

  tutti(TESTO).forEach(parole);
  tutti('.op-foto, .inv-grid .im').forEach((el) => el.classList.add('r-tenda')); // pagina opera e griglia della Home: tendina
  tutti('.opere .foto').forEach((el) => el.classList.add('r-posa')); // Work: le foto grandi salgono e si posano

  // si scoprono una volta sola, poco prima di arrivare in fondo allo schermo
  const vista = new IntersectionObserver((voci) => voci.forEach((v) => {
    if (!v.isIntersecting) return;
    v.target.classList.add('visto');
    vista.unobserve(v.target);
  }), { rootMargin: '0px 0px -9% 0px' });
  tutti('.r-fuoco, .r-tenda, .r-posa').forEach((el) => vista.observe(el));
};

document.fonts.ready.then(pronta).then(avvia);
