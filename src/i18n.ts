export type Lang = 'it' | 'en';

export const percorsi = {
  it: { home: '/it/', archivio: '/it/work/', contatti: '/it/about/', privacy: '/it/privacy/', newsletter: '/it/newsletter/', opera: (s: string) => `/it/work/${s}/` },
  en: { home: '/', archivio: '/work/', contatti: '/about/', privacy: '/privacy/', newsletter: '/newsletter/', opera: (s: string) => `/work/${s}/` },
};

export const testi = {
  it: {
    home: 'Home', archivio: 'Work', contatti: 'About', menu: 'Menu',
    altraLinguaNome: 'English',
    tuaEmail: 'Mail per la newsletter', iscriviti: 'Iscriviti',
    nlOk: 'Quasi fatto: ti ho scritto, conferma dalla mail.', nlNota: 'Iscrivendoti accetti la', nlNotaLink: 'privacy', nlNotaFine: '. Ti cancelli quando vuoi.', nlNonValida: 'Scrivi un indirizzo email valido.', nlErrore: 'Non è partita. Riprova tra un momento.',
    nlSpenta: 'La newsletter non è ancora collegata.',
    noteLegali: 'Note legali', privacy: 'Privacy', impressum: 'Impressum',
    apri: 'Apri', video: 'Video del progetto', data: 'Data', luogo: 'Luogo', scopri: 'Scopri tutto il progetto',
    anno: 'Anno', materiali: 'Materiali', misure: 'Misure', edizione: 'Edizione', ciclo: 'Progetto',
    foto: 'Foto', opere: 'opere', nuovoProgetto: 'Nuovo progetto', errore: 'Errore', vaiHome: 'Torna alla Home', nlCiSei: 'Ci sei.', nlConfermata: "Iscrizione confermata. Ti scrivo quando c'è qualcosa da vedere.", nlTitolo: 'Iscrizione confermata',
    email: 'Email', ritratto: 'Ritratto di Higle',
  },
  en: {
    home: 'Home', archivio: 'Work', contatti: 'About', menu: 'Menu',
    altraLinguaNome: 'Italiano',
    tuaEmail: 'Email for the newsletter', iscriviti: 'Subscribe',
    nlOk: "Almost there: check your inbox to confirm.", nlNota: 'By subscribing you accept the', nlNotaLink: 'privacy policy', nlNotaFine: '. Unsubscribe anytime.', nlNonValida: 'Please enter a valid email address.', nlErrore: "It didn't go through. Try again in a moment.",
    nlSpenta: 'The newsletter is not connected yet.',
    noteLegali: 'Legal', privacy: 'Privacy', impressum: 'Impressum',
    apri: 'Open', video: 'Project video', data: 'Date', luogo: 'Venue', scopri: 'See the whole project',
    anno: 'Year', materiali: 'Materials', misure: 'Dimensions', edizione: 'Edition', ciclo: 'Project',
    foto: 'Photos', opere: 'works', nuovoProgetto: 'New project', errore: 'Error', vaiHome: 'Go to Home', nlCiSei: "You're in.", nlConfermata: "Subscription confirmed. I'll write when there's something to see.", nlTitolo: 'Subscription confirmed',
    email: 'Email', ritratto: 'Portrait of Higle',
  },
} as const;
