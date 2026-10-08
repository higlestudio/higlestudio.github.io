import { LANCIATO } from '../lancio';

// in prova chiude tutto ai motori di ricerca; al lancio li lascia entrare
export const GET = () => new Response(LANCIATO ? 'User-agent: *\nAllow: /\n' : 'User-agent: *\nDisallow: /\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
