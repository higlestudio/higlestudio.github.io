# higlestudio.com

Sito di Higle: Astro + Sveltia CMS + GitHub Pages. EN alla root, IT sotto `/it/`.

## Vederlo sul computer e sul telefono

1. Serve **Node.js LTS** (nodejs.org). Per controllare: nel terminale di VS Code scrivi `node -v`.
2. In VS Code apri **questa cartella** (`10-sito/sito`), poi Terminale → Nuovo terminale.
3. La prima volta: `npm install`
4. Ogni volta: `npm run dev`
5. Il terminale scrive due indirizzi:
   - `Local  http://localhost:4321/` → sul computer. Per la vista da telefono: F12 → icona del telefono (Ctrl+Shift+M).
   - `Network http://192.168.x.x:4321/` → scrivilo nel browser del **telefono**, collegato allo stesso Wi‑Fi. Se Windows chiede il permesso al firewall, consenti "reti private".
6. Ogni file salvato si aggiorna da solo nel browser. Per fermare: Ctrl+C nel terminale.

## Dove sta cosa

| Cosa | Dove |
|---|---|
| Opere (titolo, foto, misure, testi IT/EN) | `src/content/opere/*.json` |
| Cicli (titolo, statement, "in primo piano") | `src/content/cicli/*.json` |
| Email, Instagram, bio, privacy, impressum | `src/content/pagine/sito.json` |
| Foto | `public/img/` |
| Colori, caratteri, impaginazione | `src/styles/global.css` |
| Parole fisse dell'interfaccia (menu, etichette) | `src/i18n.ts` |
| Pagine | `src/components/pagine/` |

## Online

- Sito: **https://higlestudio.com** (archivio GitHub ). Ogni salvataggio dal pannello o ogni  lo ripubblica da solo in 1-2 minuti.
- Ancora nascosto a Google: al lancio metti  in .
- **Prima di lavorare in locale**: , perché il pannello online salva direttamente su GitHub e la cartella sul computer resta indietro.

## Il pannello

Con `npm run dev` acceso, apri `http://localhost:4321/admin/` in Chrome o Edge e scegli di lavorare sulla cartella locale: modifichi opere e testi senza toccare il codice. Online è su `higlestudio.com/admin/`: «Accedi con Token di Accesso» e incolla la chiave GitHub «Pannello Higle».

I segnaposto ⚠️ vanno tolti prima del lancio. La newsletter è spenta finché non c'è la privacy: interruttore `NEWSLETTER_ATTIVA` in `src/scripts/sito.ts`.
