const ICONS = {
  futbol: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v4l-3.5 2.5L10 14h4l1.5-4.5L12 7" />
      <path d="M3.5 10.5L8.5 9.5M20.5 10.5L15.5 9.5M6 18l2.5-4M18 18l-2.5-4" />
    </svg>
  ),
  tenis: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M3.5 8c4 1 8 1 12 0M3.5 16c4-1 8-1 12 0" />
    </svg>
  ),
  basquet: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v18M3 12h18M5.5 5.5c2 2.5 2 10.5 0 13M18.5 5.5c-2 2.5-2 10.5 0 13" />
    </svg>
  ),
  paddle: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="10" cy="9" rx="6" ry="7" />
      <path d="M14.5 13.5l5 5M9 6l-1 6M7 9l3 1" />
    </svg>
  ),
  voley: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3c-3 4-3 14 0 18M3 12c4-3 14-3 18 0M5 6c3 3 11 5 17 3" />
    </svg>
  ),
  hockey: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 18h16M6 18l8-12 2 2-6 10" />
      <circle cx="18" cy="18" r="1.5" fill="currentColor" />
    </svg>
  ),
  default: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 0118 0v6a3 3 0 01-3 3h-2v-7h5M3 12v6a3 3 0 003 3h2v-7H3" />
    </svg>
  ),
};

function keyFromName(nombre = '') {
  const n = nombre.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  if (n.includes('futbol') || n.includes('fútbol') || n.includes('soccer')) return 'futbol';
  if (n.includes('tenis')) return 'tenis';
  if (n.includes('basquet') || n.includes('basket')) return 'basquet';
  if (n.includes('paddle') || n.includes('padel'))   return 'paddle';
  if (n.includes('voley')  || n.includes('volley'))  return 'voley';
  if (n.includes('hockey')) return 'hockey';
  return 'default';
}

export default function DisciplinaIcon({ nombre }) {
  return ICONS[keyFromName(nombre)];
}
