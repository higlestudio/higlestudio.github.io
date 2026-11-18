type Gc = { count?: (v: { path: string; event: boolean }) => void };

const fatti = new Set<string>();
const conta = (path: string, sempre = false, tentativi = 20) => {
  if (fatti.has(path) && !sempre) return;
  const gc = (window as unknown as { goatcounter?: Gc }).goatcounter;
  if (gc?.count) { fatti.add(path); gc.count({ path, event: true }); return; }
  if (tentativi > 0) setTimeout(() => conta(path, sempre, tentativi - 1), 500);
};

const nome = (s: string) => s.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const ultimo = (u: string) => new URL(u, location.href).pathname.split('/').filter(Boolean).pop() ?? '';

document.addEventListener('click', (e) => {
  const a = (e.target as Element).closest?.('a');
  if (!a) return;
  if (a.matches('[data-opera]')) {
    const da = a.closest('.op-altre') ? 'altre-opere' : a.closest('.inv-grid') ? 'work' : 'altro';
    conta(`apre-opera/${ultimo(a.href)}/da-${da}`, true);
  } else if (a.href.includes('instagram.com')) conta('clic/instagram');
  else if (a.href.startsWith('mailto:')) conta('clic/mail');
  else if (a.hasAttribute('download')) conta('clic/portfolio');
  else if (a.matches('.lingua')) conta(`clic/lingua-${a.hreflang || 'altra'}`);
}, { capture: true });

const blocchi = [...document.querySelectorAll<HTMLElement>('.rt .rb')];
if (blocchi.length) {
  const voci: [HTMLElement, string][] = blocchi.map((b, i) => [b, i === 0 ? 'statement' : nome(b.querySelector('h4')?.textContent ?? String(i))]);
  const fine = blocchi.at(-1)!.querySelector<HTMLElement>(':scope > div.statement:nth-of-type(2)');
  if (fine) voci.push([fine, 'domanda-finale']);
  const nomi = new Map(voci);
  const guarda = new IntersectionObserver((righe) => righe.forEach((r) => {
    if (!r.isIntersecting) return;
    guarda.unobserve(r.target);
    conta(`letto/work/${nomi.get(r.target as HTMLElement)}`);
  }), { rootMargin: '0px 0px -50% 0px' });
  voci.forEach(([el]) => guarda.observe(el));
}

const trattini = [...document.querySelectorAll<HTMLButtonElement>('.trattini button')];
if (trattini.length > 1) {
  const opera = ultimo(location.pathname);
  new MutationObserver(() => {
    const i = trattini.findIndex((b) => b.getAttribute('aria-current') === 'true');
    if (i > 0) conta(`foto/${opera}/${i + 1}`);
  }).observe(document.querySelector('.trattini')!, { subtree: true, attributes: true, attributeFilter: ['aria-current'] });
}

const nl = document.querySelector<HTMLFormElement>('#nl'), esito = document.querySelector('#nl-ok');
if (nl && esito) new MutationObserver(() => { if (esito.textContent === nl.dataset.ok) conta('newsletter/iscrizione'); }).observe(esito, { childList: true, characterData: true, subtree: true });

export {};
