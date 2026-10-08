import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://higlestudio.com',
  trailingSlash: 'always',
  build: { format: 'directory' },
  devToolbar: { enabled: false }, // la barretta di Astro in basso: solo in prova, copriva il menu
  // in prova su Windows: ricontrolla i file a intervalli, così vede sempre le modifiche (anche quelle fatte sostituendo il file)
  vite: {
    server: { watch: { usePolling: true, interval: 300 } },
    // in prova /admin/ apre il pannello come farà online (Astro da solo servirebbe solo /admin/index.html)
    plugins: [{ name: 'pannello', configureServer: (s) => { s.middlewares.use((req, _res, next) => { if (req.url === '/admin' || req.url === '/admin/') req.url = '/admin/index.html'; next(); }); } }],
  },
});
