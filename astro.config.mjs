import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://higlestudio.com',
  trailingSlash: 'always',
  build: { format: 'directory' },
  devToolbar: { enabled: false }, // la barretta di Astro in basso: solo in prova, copriva il menu
  // in prova su Windows: ricontrolla i file a intervalli, così vede sempre le modifiche (anche quelle fatte sostituendo il file)
  vite: { server: { watch: { usePolling: true, interval: 300 } } },
});
