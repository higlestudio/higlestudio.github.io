import { LANCIATO } from '../lancio';

export const GET = () => new Response(LANCIATO ? 'User-agent: *\nAllow: /\n\nSitemap: https://higlestudio.com/sitemap.xml\n' : 'User-agent: *\nDisallow: /\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
