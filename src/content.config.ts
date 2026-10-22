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
    testo_it: z.string().default(''),
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

    foto: z.array(z.object({ immagine: z.string(), alt_it: z.string().default(''), alt_en: z.string().default('') })).min(1).max(5),
    foto_quadrata: z.string().optional(),
    materiali_it: z.string().default(''),
    materiali_en: z.string().default(''),
    misure: z.string().default(''),
    testo_it: z.string().default(''),
    testo_en: z.string().default(''),
    atto_it: z.string().default(''),
    atto_en: z.string().default(''),
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
    privacy_link: z.string(),
    impressum_it: z.string(),
    impressum_en: z.string(),
    cv: z.string().optional(),
  }),
});

export const collections = { cicli, eventi, opere, pagine };
