import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://higlestudio.com',
  trailingSlash: 'always',
  build: { format: 'directory' },
  devToolbar: { enabled: false },

  vite: {
    server: { watch: { usePolling: true, interval: 300 } },

    plugins: [{ name: 'pannello', configureServer: (s) => { s.middlewares.use((req, _res, next) => { if (req.url === '/admin' || req.url === '/admin/') req.url = '/admin/index.html'; next(); }); } }],
  },
});
