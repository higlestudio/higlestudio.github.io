# higlestudio.com

Sito di Higle: Astro + Sveltia CMS + GitHub Pages. Inglese alla radice, italiano sotto `/it/`. Il telefono e il computer sono chiusi (14/10/2026): lo stato e le decisioni stanno in `00-contesto/HANDOFF.md` e `DECISIONI.md`.

## Vederlo in locale

1. Serve **Node.js LTS** (nodejs.org). Per controllare: `node -v`.
2. In VS Code apri **questa cartella** (`10-sito/sito`), poi Terminale → Nuovo terminale.
3. **Prima di tutto: `git pull`.** Il pannello online salva direttamente su GitHub e la cartella sul computer resta indietro.
4. La prima volta: `npm install`
5. Ogni volta: `npm run dev`. Il terminale scrive due indirizzi:
   - `Local http://localhost:4321/` → sul computer.
   - `Network http://192.168.x.x:4321/` → sul **telefono**, nello stesso Wi‑Fi (se Windows chiede il permesso al firewall: "reti private").
6. Per fermare: Ctrl+C. Controllo del codice: `npx astro check` (deve dare 0 errori).

Se in locale il logo del piede non si anima o i contenuti sembrano vecchi: ferma `npm run dev`, cancella `node_modules/.vite` e `node_modules/.astro/data-store.json`, riparti.

## Dove sta cosa

| Cosa | Dove |
|---|---|
| Progetti (titolo, anno, statement, eventi) | `src/content/cicli/*.json` (la cartella si chiama ancora "cicli": nel pannello è "Progetti") |
| Opere (titolo, foto, misure, materiali, testi IT/EN) | `src/content/opere/*.json` |
| Email, Instagram, ritratto, bio, link della privacy, Impressum | `src/content/pagine/sito.json` |
| Pagine (Home, Work, opera, About, Privacy, Grazie) | `src/components/pagine/` |
| Scena in cima alla Home (nuvole e Boddi) | `src/components/Nuvole.astro`, `src/scripts/nuvole.ts`, `public/img/boddi.svg` |
| Parole fisse dell'interfaccia (menu, etichette) e indirizzi | `src/i18n.ts` |
| Colori, caratteri, impaginazione (in fondo le regole per computer, da 900 px) | `src/styles/global.css` |
| Script: menu, cursore, foto, newsletter / comparse / ingresso / logo del piede / 404 | `src/scripts/` (`sito.ts`, `rivela.ts`, `hero.ts`, `piede.ts`, `vuoto.ts`) |
| Foto caricate dal pannello | `public/img/` (opere, progetti, pagine) |
| Immagini della mail di conferma e della firma Zoho | `public/img/mail/` — **non spostare né rinominare** |

## Online

- Sito: **https://higlestudio.com** (archivio GitHub `higlestudio/higlestudio.github.io`). Ogni `git push` o salvataggio dal pannello lo ripubblica da solo in 1-2 minuti.
- Ancora nascosto a Google: al lancio `LANCIATO = true` in `src/lancio.ts`.
- Pubblicare solo i propri file (`git add <file>`), mai `git add -A`: altre sessioni lavorano nella stessa cartella.

## Il pannello

Online su `higlestudio.com/admin/`: «Accedi con Token di Accesso» e incolla la chiave GitHub «Pannello Higle». In locale, con `npm run dev` acceso: `http://localhost:4321/admin/` in Chrome o Edge, "Lavora sulla cartella locale".

Foto: la principale delle opere in 4:3 (consigliato 2400×1800), più la quadrata per la griglia della Home. Finché una foto manca, sul sito resta un riquadro vuoto.
