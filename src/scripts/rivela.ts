/* animazioni quando un elemento arriva sullo schermo, senza librerie: paragrafi che salgono, testo dell'opera per righe,
   scheda a cascata, etichette da sinistra, foto che si scoprono con una tendina. Il movimento è tutto in CSS (classi r-*
   in global.css): qui si nascondono gli elementi e si scoprono una volta sola, quando entrano. Niente con "riduci movimento".
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

// il testo dell'opera "per righe": ogni parola in una finestrella; le parole della stessa riga salgono insieme.
// Si lavora sui soli nodi di testo, così grassetti, corsivi e link restano dove sono.
const parole = (p: HTMLElement) => {
  const nodi: Text[] = [];
  const giro = document.createTreeWalker(p, NodeFilter.SHOW_TEXT);
  while (giro.nextNode()) nodi.push(giro.currentNode as Text);
  nodi.forEach((n) => {
    const pezzi = n.data.split(/(\s+)/).filter(Boolean);
    const f = document.createDocumentFragment();
    pezzi.forEach((x) => {
      if (/^\s+$/.test(x)) { f.append(x); return; }
      const fin = document.createElement('span'), dentro = document.createElement('span');
      fin.className = 'r-parola'; dentro.textContent = x; fin.append(dentro); f.append(fin);
    });
    n.replaceWith(f);
  });
  p.classList.add('r-righe');
};
// al momento di scoprire: le parole con la stessa altezza sono una riga, e ogni riga parte 0,07 s dopo la precedente
const ritardiRighe = (p: HTMLElement) => {
  const alte: number[] = [];
  p.querySelectorAll<HTMLElement>('.r-parola').forEach((w) => {
    const y = Math.round(w.offsetTop);
    let i = alte.indexOf(y); if (i < 0) { alte.push(y); i = alte.length - 1; }
    ritardo(w.firstElementChild as HTMLElement, i * 0.07);
  });
};

const avvia = () => {
  if (!movimento) return;

  // chi deve entrare, e come
  tutti('.statement .corpo p, .me .bio p').forEach((el) => el.classList.add('r-sale'));          // paragrafi: salgono e si schiariscono
  tutti('.op-testo p').forEach(parole);                                                            // testo dell'opera: per righe
  tutti('.op-dati > *').forEach((el, i) => { el.classList.add('r-sale', 'r-corto'); ritardo(el, i * 0.08); }); // scheda: a cascata
  tutti('#op-st, #op-altre').forEach((el) => el.classList.add('r-sx'));                            // etichette: da sinistra
  tutti('.op-foto, .inv-grid:not(.gruppo .inv-grid) .im').forEach((el) => el.classList.add('r-tenda')); // foto: tendina (in Home no)

  // si scoprono una volta sola, poco prima di arrivare in fondo allo schermo
  const vista = new IntersectionObserver((voci) => voci.forEach((v) => {
    if (!v.isIntersecting) return;
    const el = v.target as HTMLElement;
    if (el.classList.contains('r-righe')) ritardiRighe(el);
    el.classList.add('visto');
    vista.unobserve(el);
  }), { rootMargin: '0px 0px -9% 0px' });
  tutti('.r-sale, .r-righe, .r-sx, .r-tenda').forEach((el) => vista.observe(el));

  // Work: le foto di un progetto si scoprono quando il progetto si apre (quello in primo piano subito);
  // sul telefono una riga alla volta (le due della riga insieme), sul computer una dopo l'altra
  const telefono = matchMedia('(max-width: 899px)');
  const scopri = (g: Element) => g.querySelectorAll<HTMLElement>('.im').forEach((im, i) => {
    // riparte da chiusa anche se il progetto si riapre: si richiude senza transizione, poi si scopre
    im.style.transition = 'none'; im.classList.remove('visto'); im.classList.add('r-tenda');
    void im.offsetWidth;
    im.style.transition = '';
    ritardo(im, telefono.matches ? Math.floor(i / 2) * 0.14 : i * 0.07);
    im.classList.add('visto');
  });
  tutti('details.gruppo[open]').forEach(scopri);
  document.addEventListener('work:aperto', (e) => scopri((e as CustomEvent<Element>).detail));
};

document.fonts.ready.then(pronta).then(avvia);
