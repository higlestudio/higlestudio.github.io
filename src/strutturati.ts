import { percorsi, testi, type Lang } from './i18n';
import { testoPiano, primoParagrafo, titoloCiclo } from './dati';

const assoluto = (p: string, site: URL) => new URL(p, site).href;
const idHigle = (site: URL) => assoluto('/#higle', site);

export function grafoBase(s: any, lang: Lang, site: URL) {
  const t = testi[lang];
  const descrizione = lang === 'it' ? s.descrizione_about_it : s.descrizione_about_en;
  return [
    {
      '@type': 'Person',
      '@id': idHigle(site),
      name: 'Higle',
      alternateName: 'Higle Studio',
      givenName: 'Simone',
      jobTitle: t.artista,
      birthDate: '2001',
      birthPlace: { '@type': 'City', name: t.torino },
      workLocation: { '@type': 'City', name: t.berlino },
      url: assoluto(percorsi[lang].contatti, site),
      image: assoluto(s.ritratto, site),
      email: s.email,
      sameAs: [`https://www.instagram.com/${s.instagram}/`],
      ...(descrizione ? { description: descrizione } : {}),
    },
    {
      '@type': 'WebSite',
      '@id': assoluto('/#sito', site),
      name: 'Higle Studio',
      url: site.href,
      inLanguage: ['en', 'it'],
      publisher: { '@id': idHigle(site) },
    },
  ];
}

const idProgetto = (ciclo: any, lang: Lang, site: URL) => assoluto(`${percorsi[lang].archivio}#${ciclo.id}`, site);
const idOpera = (id: string, lang: Lang, site: URL) => assoluto(`${percorsi[lang].opera(id)}#opera`, site);

export function datiProgetto(ciclo: any, lista: any[], lang: Lang, site: URL) {
  const statement = lang === 'it' ? ciclo.data.statement_it : ciclo.data.statement_en;
  return {
    '@type': 'CreativeWorkSeries',
    '@id': idProgetto(ciclo, lang, site),
    name: titoloCiclo(ciclo, lang),
    url: assoluto(percorsi[lang].archivio, site),
    inLanguage: lang,
    dateCreated: String(ciclo.data.anno),
    creator: { '@id': idHigle(site) },
    description: testoPiano(primoParagrafo(statement)),
    hasPart: lista.map((o) => ({
      '@type': 'VisualArtwork',
      '@id': idOpera(o.id, lang, site),
      name: o.data.titolo,
      url: assoluto(percorsi[lang].opera(o.id), site),
    })),
  };
}

export function datiOpera(opera: any, ciclo: any, lang: Lang, site: URL) {
  const o = opera.data;
  const it = lang === 'it';
  const testo = testoPiano(it ? o.testo_it : o.testo_en);
  const tecnica = (it ? o.tecnica_it : o.tecnica_en).trim();
  const materiali = (it ? o.materiali_it : o.materiali_en).trim();
  const url = assoluto(percorsi[lang].opera(opera.id), site);
  return [
    {
      '@type': 'VisualArtwork',
      '@id': idOpera(opera.id, lang, site),
      name: o.titolo,
      url,
      inLanguage: lang,
      dateCreated: String(o.anno),
      creator: { '@id': idHigle(site) },
      image: o.foto.map((f: { immagine: string }) => assoluto(f.immagine, site)),
      isPartOf: { '@id': idProgetto(ciclo, lang, site), name: titoloCiclo(ciclo, lang) },
      ...(testo ? { description: testo } : {}),
      ...(tecnica ? { artMedium: tecnica } : {}),
      ...(materiali ? { material: materiali } : {}),
      ...(o.misure ? { size: o.misure } : {}),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: testi[lang].archivio, item: assoluto(percorsi[lang].archivio, site) },
        { '@type': 'ListItem', position: 2, name: o.titolo, item: url },
      ],
    },
  ];
}
