import { defineCollection, z } from 'astro:content';
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

const opere = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/opere' }),
  schema: z.object({
    slug: z.string().optional(),
    titolo: z.string(),
    ciclo: z.string(),
    numero: z.string(),
    ordine: z.number().default(0),
    anno: z.number(),
    foto: z.string(),
    foto_quadrata: z.string().optional(),
    altre_foto: z.array(z.string()).max(4).default([]),
    fondo: z.string().default('#33302C'),
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
    privacy_it: z.string(),
    privacy_en: z.string(),
    impressum: z.string(),
  }),
});

export const collections = { cicli, opere, pagine };
