import { opere } from '../dati';

export async function GET({ site }: { site: URL }) {
  const percorsi = ['', 'work/', 'about/', 'privacy/', ...(await opere()).map((o) => `work/${o.id}/`)];
  const url = (p: string, it: boolean) => new URL((it ? 'it/' : '') + p, site).href;
  const voce = (p: string, it: boolean) => `  <url>
    <loc>${url(p, it)}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${url(p, false)}"/>
    <xhtml:link rel="alternate" hreflang="it" href="${url(p, true)}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${url(p, false)}"/>
  </url>`;
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${percorsi.flatMap((p) => [voce(p, false), voce(p, true)]).join('\n')}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
