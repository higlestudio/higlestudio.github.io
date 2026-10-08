export type Lang = 'it' | 'en';

export const percorsi = {
  it: { home: '/it/', archivio: '/it/work/', contatti: '/it/about/', privacy: '/it/privacy/', opera: (s: string) => `/it/work/${s}/` },
  en: { home: '/', archivio: '/work/', contatti: '/about/', privacy: '/privacy/', opera: (s: string) => `/work/${s}/` },
};

export const testi = {
  it: {
    home: 'Home', archivio: 'Work', contatti: 'About', menu: 'Menu',
    altraLingua: 'EN', altraLinguaNome: 'English',
    newsletter: 'Newsletter', tuaEmail: 'La tua email', iscriviti: 'Iscriviti',
    nlOk: 'Ci sei.', nlNonValida: 'Scrivi un indirizzo email valido.', nlErrore: 'Non è partita. Riprova tra un momento.',
    nlSpenta: '⚠️ La newsletter non è ancora collegata.',
    noteLegali: 'Note legali', privacy: 'Privacy', impressum: 'Impressum',
    apri: 'Apri', cliccami: 'Cliccami', apriOpera: 'Apri', logoCade: 'Fai cadere il logo e scendi alle opere',
    anno: 'Anno', materiali: 'Materiali', misure: 'Misure', edizione: 'Edizione', ciclo: 'Progetto',
    ilCiclo: 'Il progetto', altreOpere: 'Le altre opere del progetto', foto: 'Foto',
    email: 'Email', ritratto: 'Ritratto di Higle',
  },
  en: {
    home: 'Home', archivio: 'Work', contatti: 'About', menu: 'Menu',
    altraLingua: 'IT', altraLinguaNome: 'Italiano',
    newsletter: 'Newsletter', tuaEmail: 'Your email', iscriviti: 'Subscribe',
    nlOk: "You're in.", nlNonValida: 'Please enter a valid email address.', nlErrore: "It didn't go through. Try again in a moment.",
    nlSpenta: '⚠️ The newsletter is not connected yet.',
    noteLegali: 'Legal', privacy: 'Privacy', impressum: 'Impressum',
    apri: 'Open', cliccami: 'Click me', apriOpera: 'Open', logoCade: 'Drop the logo and scroll to the works',
    anno: 'Year', materiali: 'Materials', misure: 'Dimensions', edizione: 'Edition', ciclo: 'Project',
    ilCiclo: 'The project', altreOpere: 'Other works in the project', foto: 'Photos',
    email: 'Email', ritratto: 'Portrait of Higle',
  },
} as const;
