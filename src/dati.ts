import { getCollection, getEntry } from 'astro:content';
import { marked } from 'marked';
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

export const md = (s: string) => marked.parse(s ?? '') as string;
export const mdInline = (s: string) => marked.parseInline(s ?? '') as string;
