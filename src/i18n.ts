export type Lang = 'it' | 'en';

export const percorsi = {
  it: { home: '/it/', archivio: '/it/work/', contatti: '/it/about/', privacy: '/it/privacy/', opera: (s: string) => `/it/work/${s}/` },
  en: { home: '/', archivio: '/work/', contatti: '/about/', privacy: '/privacy/', opera: (s: string) => `/work/${s}/` },
};

export const testi = {
  it: {
    home: 'Home', archivio: 'Work', contatti: 'About', menu: 'Menu',
    altraLinguaNome: 'English',
    tuaEmail: 'Mail per la newsletter', iscriviti: 'Iscriviti',
    nlOk: 'Ci sei.', nlNonValida: 'Scrivi un indirizzo email valido.', nlErrore: 'Non è partita. Riprova tra un momento.',
    nlSpenta: '⚠️ La newsletter non è ancora collegata.',
    noteLegali: 'Note legali', privacy: 'Privacy', impressum: 'Impressum',
    apri: 'Apri', video: 'Video del progetto', scopri: 'Scopri tutto il progetto',
    anno: 'Anno', materiali: 'Materiali', misure: 'Misure', edizione: 'Edizione', ciclo: 'Progetto',
    ilCiclo: 'Il progetto', altreOpere: 'Le altre opere del progetto', foto: 'Foto',
    email: 'Email', ritratto: 'Ritratto di Higle',
  },
  en: {
    home: 'Home', archivio: 'Work', contatti: 'About', menu: 'Menu',
    altraLinguaNome: 'Italiano',
    tuaEmail: 'Email for the newsletter', iscriviti: 'Subscribe',
    nlOk: "You're in.", nlNonValida: 'Please enter a valid email address.', nlErrore: "It didn't go through. Try again in a moment.",
    nlSpenta: '⚠️ The newsletter is not connected yet.',
    noteLegali: 'Legal', privacy: 'Privacy', impressum: 'Impressum',
    apri: 'Open', video: 'Project video', scopri: 'See the whole project',
    anno: 'Year', materiali: 'Materials', misure: 'Dimensions', edizione: 'Edition', ciclo: 'Project',
    ilCiclo: 'The project', altreOpere: 'Other works in the project', foto: 'Photos',
    email: 'Email', ritratto: 'Portrait of Higle',
  },
} as const;
