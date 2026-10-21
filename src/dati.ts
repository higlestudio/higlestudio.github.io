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

export async function eventi() {
  return (await getCollection('eventi', (e) => e.data.attivo)).sort((a, b) => a.data.ordine - b.data.ordine);
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

export function primoParagrafo(md: string) {
  return marked.parseInline(md.trim().split(/\n\s*\n/)[0] ?? '') as string;
}

const fondi = new Map<string, Promise<string>>();
const FONDO = '#E8E9E5';
export function fondoDi(foto: string): Promise<string> {
  if (!fondi.has(foto)) fondi.set(foto, (async () => {
    try {
      const N = 32;
      const { data } = await sharp(`public${foto}`)
        .resize(N, N, { fit: 'fill' }).removeAlpha().raw().toBuffer({ resolveWithObject: true });

      const bordo: number[][] = [];
      for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
        if (x > 0 && x < N - 1 && y > 0 && y < N - 1) continue;
        const i = (y * N + x) * 3; bordo.push([data[i], data[i + 1], data[i + 2]]);
      }
      const luce = (p: number[]) => p[0] + p[1] + p[2];
      bordo.sort((a, b) => luce(a) - luce(b));
      return '#' + bordo[bordo.length >> 1].map((c) => c.toString(16).padStart(2, '0')).join('');
    } catch { return FONDO; }
  })());
  return fondi.get(foto)!;
}

export const md = (s: string) => marked.parse(s ?? '') as string;
