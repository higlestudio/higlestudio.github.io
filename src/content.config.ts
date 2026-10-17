import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const cicli = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/cicli' }),
  schema: z.object({
    slug: z.string().optional(),
    titolo_it: z.string(),
    titolo_en: z.string(),
    anno: z.number(),
    in_primo_piano: z.boolean().default(false),
    statement_it: z.string().default(''),
    statement_en: z.string().default(''),
  }),
});

// 17/10: gli eventi (mostre, presentazioni…) in una sezione a sé del pannello, un file per evento. In Home escono quelli
// con "Mostra in Home" acceso, nell'ordine scelto; se nessuno è acceso la parte degli eventi non c'è
const eventi = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/eventi' }),
  schema: z.object({
    titolo_it: z.string().default(''),
    titolo_en: z.string().default(''),
    attivo: z.boolean().default(true),
    ordine: z.number().default(0),
    data_it: z.string().default(''),
    data_en: z.string().default(''),
    luogo_it: z.string().default(''),
    luogo_en: z.string().default(''),
    testo_it: z.string().default(''), // qualche riga: sul telefono si apre con la freccetta, sul computer sta sotto il luogo
    testo_en: z.string().default(''),
    locandina: z.string().optional(),
    link: z.string().optional(),
  }),
});

const opere = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/opere' }),
  schema: z.object({
    slug: z.string().optional(),
    titolo: z.string(),
    ciclo: z.string(),
    ordine: z.number().default(0),
    anno: z.number(),
    foto: z.string(),
    // 17/10: il testo alternativo di ogni foto (per chi non vede e per Google), in IT e in EN; vuoto = il nome dell'opera
    foto_alt_it: z.string().default(''),
    foto_alt_en: z.string().default(''),
    foto_quadrata: z.string().optional(), // per la griglia della Home; stesso testo alternativo della principale
    altre_foto: z.array(z.object({ foto: z.string(), alt_it: z.string().default(''), alt_en: z.string().default('') })).max(4).default([]),
    fondo: z.string().optional(), // vuoto = preso dalla foto (dati.ts, fondoDi)
    materiali_it: z.string().default(''),
    materiali_en: z.string().default(''),
    misure: z.string().default(''),
    edizione_it: z.string().default('Pezzo unico'),
    edizione_en: z.string().default('Unique piece'),
    testo_it: z.string().default(''),
    testo_en: z.string().default(''),
    bozza: z.boolean().default(false),
  }),
});

const pagine = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/pagine' }),
  schema: z.object({
    email: z.string(),
    instagram: z.string(),
    ritratto: z.string(),
    bio_it: z.string(),
    bio_en: z.string(),
    privacy_link: z.string(), // 15/10: la policy Iubenda, in inglese (una sola)
    impressum_it: z.string(), // 15/10: per ora non pubblicato (residenza ancora in Italia)
    impressum_en: z.string(),
  }),
});

export const collections = { cicli, eventi, opere, pagine };
