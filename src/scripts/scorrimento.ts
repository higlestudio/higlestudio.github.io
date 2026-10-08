/* animazioni legate allo scorrimento (GSAP + ScrollTrigger): paragrafi, testo e scheda dell'opera, foto che si scoprono. Caricato da Home, Work, About e pagina opera. Niente con "riduci movimento". */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);
// su iPhone la barra di Safari cambia l'altezza a ogni scorrimento: non ricalcolare per quello
ScrollTrigger.config({ ignoreMobileResize: true });

const html = document.documentElement;

// in Home, durante l'ingresso la pagina è nascosta: si parte quando compare
const pronta = () => new Promise<void>((ok) => {
  if (!html.matches('.intro, .intro-resto')) return ok();
  const o = new MutationObserver(() => { if (!html.matches('.intro, .intro-resto')) { o.disconnect(); ok(); } });
  o.observe(html, { attributes: true, attributeFilter: ['class'] });
});

const avvia = () => gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
  // 1. paragrafi dello statement e della bio: salgono e si schiariscono, uno alla volta
  gsap.utils.toArray<HTMLElement>('.statement .corpo p, .me .bio p').forEach((p) => gsap.from(p, {
    y: 24, opacity: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: p, start: 'top 92%', once: true },
  }));

  // 2. pagina opera: il testo sale riga per riga da dietro una maschera
  document.querySelectorAll<HTMLElement>('.op-testo p').forEach((el) => {
    SplitText.create(el, {
      type: 'lines', mask: 'lines', autoSplit: true,
      onSplit: (s) => gsap.from(s.lines, {
        yPercent: 105, duration: 0.9, ease: 'power3.out', stagger: 0.07,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      }),
    });
  });

  // 3. pagina opera: le voci della scheda entrano a cascata
  const scheda = document.querySelector('.op-dati');
  if (scheda) gsap.from(scheda.children, { y: 16, opacity: 0, duration: 0.6, ease: 'power2.out', stagger: 0.08, scrollTrigger: { trigger: scheda, start: 'top 90%', once: true } });

  // 4. pagina opera: le etichette IL PROGETTO e LE ALTRE OPERE scorrono dentro da sinistra
  gsap.utils.toArray<HTMLElement>('#op-st, #op-altre').forEach((e) => gsap.from(e, {
    x: -24, opacity: 0, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: e, start: 'top 92%', once: true },
  }));

  // 5. foto: una tendina che si apre dal basso
  const tendina = { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.1, ease: 'power3.inOut', clearProps: 'clipPath' };
  document.querySelectorAll<HTMLElement>('.op-foto, .inv-grid:not(.gruppo .inv-grid) .im').forEach((box) => { // in Home niente tendina (8/10)
    gsap.from(box, { ...tendina, scrollTrigger: { trigger: box, start: 'top 90%', once: true } });
  });
  // in Work le foto di un progetto si scoprono quando il progetto si apre (quello in primo piano subito, all'apertura della pagina):
  // sul telefono una riga alla volta (le due foto della riga insieme), sul computer una dopo l'altra
  const telefono = matchMedia('(max-width: 899px)');
  const scopri = (g: Element) => gsap.from(g.querySelectorAll('.im'), { ...tendina, stagger: (i) => (telefono.matches ? Math.floor(i / 2) * 0.14 : i * 0.07) });
  document.querySelectorAll('details.gruppo[open]').forEach(scopri);
  document.addEventListener('work:aperto', (e) => scopri((e as CustomEvent<Element>).detail));
});

document.fonts.ready.then(pronta).then(avvia);

// Work: aprendo o chiudendo un progetto la pagina cambia altezza, i punti di partenza vanno ricalcolati
document.addEventListener('work:cambiato', () => ScrollTrigger.refresh());
