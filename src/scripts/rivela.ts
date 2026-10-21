const html = document.documentElement;
const movimento = matchMedia('(prefers-reduced-motion: no-preference)').matches;

const pronta = () => new Promise<void>((ok) => {
  if (!html.matches('.intro, .intro-resto')) return ok();
  const o = new MutationObserver(() => { if (!html.matches('.intro, .intro-resto')) { o.disconnect(); ok(); } });
  o.observe(html, { attributes: true, attributeFilter: ['class'] });
});

const tutti = <T extends HTMLElement = HTMLElement>(sel: string) => [...document.querySelectorAll<T>(sel)];

const TESTO = [
  '.prog-intro h2', '.prog-lead',
  '.st-work .st-titolo', '.statement > *',
  '.me .bio > *',
  '.op-testo > *',
].join(', ');

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

  tutti(TESTO).forEach((el) => el.classList.add('r-scende'));
  tutti('.op-foto, .inv-grid .im, .opere .foto').forEach((el) => el.classList.add('r-tenda'));

  const vicino = new IntersectionObserver((voci) => voci.forEach((v) => {
    if (!v.isIntersecting) return;
    v.target.querySelectorAll('img').forEach((i) => { i.loading = 'eager'; });
    vicino.unobserve(v.target);
  }), { rootMargin: '0px 0px 150% 0px' });
  tutti('.r-tenda').forEach((el) => vicino.observe(el));

  const vista = new IntersectionObserver((voci) => voci.forEach((v) => {
    if (!v.isIntersecting) return;
    vista.unobserve(v.target);
    if (v.target.classList.contains('r-tenda')) fotoPronta(v.target).then(() => v.target.classList.add('visto'));
    else v.target.classList.add('visto');
  }), { rootMargin: '0px 0px -9% 0px' });
  tutti('.r-scende, .r-tenda').forEach((el) => vista.observe(el));
};

document.fonts.ready.then(pronta).then(avvia);
