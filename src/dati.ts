import { getCollection, getEntry } from 'astro:content';
import { marked } from 'marked';
import sharp from 'sharp';
import type { Lang } from './i18n';

export async function cicli() {
  return (await getCollection('cicli')).sort((a, b) => b.data.anno - a.data.anno);
}

export async function cicloInPrimoPiano() {
  const tutti = await cicli();
  return tutti.find((c) => c.data.in_primo_piano) ?? tutti[0];
}

export async function opere(ciclo?: string) {
  return (await getCollection('opere', (o) => !o.data.bozza && (!ciclo || o.data.ciclo === ciclo)))
    .sort((a, b) => a.data.ordine - b.data.ordine);
}

export async function sito() {
  return (await getEntry('pagine', 'sito'))!.data;
}

export const titoloCiclo = (c: { data: { titolo_it: string; titolo_en: string } }, l: Lang) =>
  l === 'it' ? c.data.titolo_it : c.data.titolo_en;

/** lo statement: il primo paragrafo è grande, il resto è corpo */
export function statement(md: string) {
  const par = md.trim().split(/\n\s*\n/);
  return { lead: marked.parseInline(par[0] ?? '') as string, corpo: marked.parse(par.slice(1).join('\n\n')) as string };
}

/** il colore di fondo dietro una foto, preso dalla foto stessa (11/10): la media dei suoi bordi, dove la foto incontra il riquadro.
 *  Si calcola alla pubblicazione, quindi caricata una foto nuova il fondo si aggiorna da solo. Un colore scelto nel pannello vince. */
const fondi = new Map<string, Promise<string>>();
export function fondoDi(foto: string | undefined, scelto?: string): Promise<string> {
  if (scelto) return Promise.resolve(scelto);
  if (!foto) return Promise.resolve('#33302C'); // 14/10: senza foto, il riquadro vuoto resta grigio scuro
  if (!fondi.has(foto)) fondi.set(foto, (async () => {
    try {
      const N = 32; // la foto ridotta a 32 × 32: bastano i bordi
      const { data } = await sharp(`public${foto}`) // percorso dalla cartella del sito, dove gira la pubblicazione
        .resize(N, N, { fit: 'fill' }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
      // i pixel del bordo; il valore di mezzo (non la media), così un pezzo dell'opera che tocca il bordo (un cavo, una base) non lo sporca
      const bordo: number[][] = [];
      for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
        if (x > 0 && x < N - 1 && y > 0 && y < N - 1) continue;
        const i = (y * N + x) * 3; bordo.push([data[i], data[i + 1], data[i + 2]]);
      }
      const luce = (p: number[]) => p[0] + p[1] + p[2];
      bordo.sort((a, b) => luce(a) - luce(b));
      return '#' + bordo[bordo.length >> 1].map((c) => c.toString(16).padStart(2, '0')).join('');
    } catch { return '#33302C'; }
  })());
  return fondi.get(foto)!;
}

export const md = (s: string) => marked.parse(s ?? '') as string;
export const mdInline = (s: string) => marked.parseInline(s ?? '') as string;
