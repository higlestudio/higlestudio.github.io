const calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;
const largo = matchMedia('(min-width: 900px)');
const DURATA = 450;

document.querySelectorAll<HTMLElement>('[data-racconto]').forEach((racconto) => {
  const foto = [...racconto.querySelectorAll<HTMLElement>('.rg-foto')];
  const blocchi = [...racconto.querySelectorAll<HTMLElement>('.rb')];
  let attiva = 0;
  let voluta = 0;
  let inCorso = false;

  const passa = async () => {
    if (inCorso || voluta === attiva) return;
    inCorso = true;
    const arrivo = voluta;
    const prima = foto[attiva];
    const dopo = foto[arrivo];
    const img = dopo.querySelector('img')!;
    img.loading = 'eager';
    await Promise.race([img.decode().catch(() => {}), new Promise((ok) => setTimeout(ok, 1500))]);
    let anim: Animation | null = null;
    if (!calmo) {
      dopo.classList.add('entra');
      anim = dopo.animate([{ opacity: 0 }, { opacity: 1 }], { duration: DURATA, easing: 'ease-in-out', fill: 'forwards' });
      await anim.finished.catch(() => {});
    }
    dopo.classList.add('su');
    dopo.classList.remove('entra');
    prima.classList.remove('su');
    anim?.cancel();
    attiva = arrivo;
    inCorso = false;
    passa();
  };

  const vai = (n: number) => {
    voluta = n;
    passa();
  };

  let guarda: IntersectionObserver | null = null;
  const osserva = () => {
    guarda?.disconnect();
    if (!largo.matches) return;
    guarda = new IntersectionObserver((righe) => {
      const dentro = righe.filter((v) => v.isIntersecting).pop();
      if (!dentro) return;
      vai(Number((dentro.target as HTMLElement).dataset.foto));
    }, { rootMargin: '-40% 0px -59% 0px' });
    blocchi.forEach((b) => guarda!.observe(b));
  };
  osserva();
  largo.addEventListener('change', osserva);

  if (calmo) return;
  const frasi = [...racconto.querySelectorAll<HTMLElement>('.rt .st-titolo, .rt .statement > *')];
  frasi.forEach((frase) => {
    const testi: Text[] = [];
    const giro = document.createTreeWalker(frase, NodeFilter.SHOW_TEXT);
    while (giro.nextNode()) testi.push(giro.currentNode as Text);
    let n = 0;
    testi.forEach((nodo) => {
      const pezzi = (nodo.textContent ?? '').split(/(\s+)/);
      const nuovo = document.createDocumentFragment();
      pezzi.forEach((p) => {
        if (!p) return;
        if (/^\s+$/.test(p)) { nuovo.append(p); return; }
        const s = document.createElement('span');
        s.className = 'pw';
        s.style.setProperty('--i', String(n++));
        s.textContent = p;
        nuovo.append(s);
      });
      nodo.replaceWith(nuovo);
    });
    frase.classList.add('parole');
  });
  const PASSO = 22;
  let libero = 0;
  const appare = new IntersectionObserver((righe) => righe.filter((r) => r.isIntersecting).forEach((r) => {
    const frase = r.target as HTMLElement;
    appare.unobserve(frase);
    const ora = performance.now();
    const attesa = Math.min(500, Math.max(0, libero - ora));
    libero = ora + attesa + frase.querySelectorAll('.pw').length * PASSO;
    frase.style.setProperty('--attesa', `${attesa}ms`);
    frase.classList.add('visto');
  }), { rootMargin: '0px 0px -12% 0px' });
  frasi.forEach((f) => appare.observe(f));
});
