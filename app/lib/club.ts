/**
 * Club de lectura de medianoche. Las sesiones se venden como variantes del producto
 * `club-de-medianoche` (opción «Sesión» × «Lugares», a $0), así cada reserva es un pedido.
 */
export const CLUB_PRODUCT_HANDLE = 'club-de-medianoche';

export type ClubSession = {
  /** Valor exacto de la opción «Sesión» en Shopify. */
  option: string | null;
  month: string;
  day: string;
  weekday: string;
  dateLong: string;
  book: string;
  bookHandle: string | null;
  author: string;
  status: 'next' | 'soon' | 'tbd';
  tag: string;
  cover: {bg: string; ink: string} | null;
};

export const CLUB_SESSIONS: ClubSession[] = [
  {
    option: 'Vie 30 oct · Carmilla',
    month: 'OCT',
    day: '30',
    weekday: 'Viernes',
    dateLong: 'Viernes 30 de octubre',
    book: 'Carmilla',
    bookHandle: 'carmilla',
    author: 'J. S. Le Fanu',
    status: 'next',
    tag: 'Próxima sesión',
    cover: {bg: '#ea580c', ink: '#1e1b4b'},
  },
  {
    option: 'Vie 27 nov · El Horla',
    month: 'NOV',
    day: '27',
    weekday: 'Viernes',
    dateLong: 'Viernes 27 de noviembre',
    book: 'El Horla',
    bookHandle: 'el-horla',
    author: 'Guy de Maupassant',
    status: 'soon',
    tag: 'Reservas abiertas',
    cover: {bg: '#c2410c', ink: '#fdfbf7'},
  },
  {
    option: null,
    month: 'DIC',
    day: '—',
    weekday: 'Por anunciar',
    dateLong: 'Diciembre',
    book: 'Por anunciar',
    bookHandle: null,
    author: 'Se revela con la luna llena',
    status: 'tbd',
    tag: 'Por anunciar',
    cover: null,
  },
];

export const CLUB_PAST = ['dracula', 'frankenstein', 'la-caida-de-la-casa-usher', 'los-sauces'];

export const SEAT_OPTIONS = [
  {value: '1 lugar', label: 'Solo yo', sub: '1 lugar'},
  {value: '2 lugares', label: 'Con un acompañante', sub: '2 lugares'},
];
