import type {SVGProps} from 'react';

const PATHS = {
  bag: 'M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4ZM3 6h18M16 10a4 4 0 0 1-8 0',
  heart:
    'M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z',
  eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12ZM9 12a3 3 0 1 0 6 0a3 3 0 1 0-6 0',
  search: 'M4 11a7 7 0 1 0 14 0a7 7 0 1 0-14 0M20 20l-3.5-3.5',
  user: 'M8 8a4 4 0 1 0 8 0a4 4 0 1 0-8 0M4 21c0-4 4-6 8-6s8 2 8 6',
  menu: 'M4 6h16M4 12h16M4 18h16',
  x: 'M18 6 6 18M6 6l12 12',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  chev: 'm9 6 6 6-6 6',
  back: 'm15 18-6-6 6-6',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  check: 'M20 6 9 17l-5-5',
  candle: 'M12 2c-2 3-2 5 0 6 2-1 2-3 0-6ZM9 10h6v12H9Z',
  moon: 'M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z',
  package: 'M21 8 12 3 3 8v8l9 5 9-5ZM3 8l9 5 9-5M12 13v8',
  truck:
    'M3 6h11v10H3ZM14 9h4l3 3v4h-7M5.2 17.5a1.8 1.8 0 1 0 3.6 0a1.8 1.8 0 1 0-3.6 0M15.2 17.5a1.8 1.8 0 1 0 3.6 0a1.8 1.8 0 1 0-3.6 0',
  card: 'M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2ZM2 10h20M6 15h4',
  return: 'M9 14 4 9l5-5M4 9h11a5 5 0 0 1 0 10h-3',
  book: 'M4 19.5V5a2 2 0 0 1 2-2h14v16H6.5A2.5 2.5 0 0 0 4 21.5ZM4 19.5A2.5 2.5 0 0 1 6.5 17H20',
  mail: 'M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2ZM3 7l9 6 9-6',
  pin: 'M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11ZM9.5 10a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0',
  clock: 'M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0M12 7v5l3 2',
  phone:
    'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z',
  access: 'M10 5a2 2 0 1 0 4 0a2 2 0 1 0-4 0M5 9l7 1 7-1M12 10v5l-3 6M12 15l3 6',
  feather:
    'M20.2 3.8a5.5 5.5 0 0 0-7.8 0L5 11.2V19h7.8l7.4-7.4a5.5 5.5 0 0 0 0-7.8ZM16 8 2 22M17.5 15H9',
  file: 'M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9ZM14 3v6h6M9 14h6M9 17h4',
  lock: 'M6 10h12a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1ZM8 10V7a4 4 0 0 1 8 0v3',
  logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
  ghost:
    'M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8ZM9 10h.01M15 10h.01',
  bell: 'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0',
  alert: 'M12 8v5M12 16.5h.01',
  info: 'M12 11v5M12 7.5h.01',
  camera:
    'M4 7h3l2-3h6l2 3h3a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1ZM9 13a3 3 0 1 0 6 0a3 3 0 1 0-6 0',
  users:
    'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M5 7a4 4 0 1 0 8 0a4 4 0 1 0-8 0M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
  calendar:
    'M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2ZM16 2v4M8 2v4M3 10h18',
  help: 'M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.5V14M12 17.5h.01',
  share: 'M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13',
  copy: 'M9 9h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V11a2 2 0 0 1 2-2ZM5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1',
  trash: 'M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2',
  edit: 'M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z',
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({
  name,
  size = 20,
  strokeWidth = 2,
  ...rest
}: {name: IconName; size?: number; strokeWidth?: number} & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}

export function Bat({className, style}: {className?: string; style?: React.CSSProperties}) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 12" fill="#1e1b4b" aria-hidden="true">
      <path d="M0 8C4 2 8 2 10 6C11 4 13 4 14 6C16 2 20 2 24 8C20 6 18 8 17 11C15 9 13 10 12 12C11 10 9 9 7 11C6 8 4 6 0 8Z" />
    </svg>
  );
}

export function Sparkle({className, style, fill = '#7e22ce'}: {className?: string; style?: React.CSSProperties; fill?: string}) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill={fill} aria-hidden="true">
      <path d="M12 0c1 7 5 11 12 12-7 1-11 5-12 12-1-7-5-11-12-12 7-1 11-5 12-12Z" />
    </svg>
  );
}

export function Logo({size = 36}: {size?: number}) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path d="M5 38V19L3 20 20 4l17 15-2-.5V38Z" fill="#1e1b4b" />
      <path d="M26 9V4h4v9" fill="#1e1b4b" />
      <circle cx="20" cy="20" r="5.5" fill="#f97316" />
      <path d="M20 14.5v11M14.5 20h11" stroke="#1e1b4b" strokeWidth="1.6" />
      <path d="M16 38v-7a4 4 0 0 1 8 0v7" fill="#fdba74" />
    </svg>
  );
}

export function Cobweb({className}: {className?: string}) {
  return (
    <svg className={className} width="90" height="90" viewBox="0 0 100 100" fill="none" stroke="#d8b4fe" strokeWidth="1.2" aria-hidden="true">
      <path d="M0 0 100 30M0 0 70 70M0 0 30 100" />
      <path d="M24 7Q20 16 14 20Q8 22 7 24" />
      <path d="M50 15Q40 32 32 40Q20 46 15 50" />
      <path d="M78 23Q62 50 52 60Q36 70 23 78" />
    </svg>
  );
}

export function Pumpkin({size = 36}: {size?: number}) {
  return (
    <svg width={size} height={size * 0.9} viewBox="0 0 40 36" aria-hidden="true">
      <path d="M20 8c0-4 2-6 5-7" fill="none" stroke="#3f6212" strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="13" cy="22" rx="9" ry="12" fill="#ea580c" />
      <ellipse cx="27" cy="22" rx="9" ry="12" fill="#ea580c" />
      <ellipse cx="20" cy="22" rx="8" ry="13" fill="#f97316" />
      <path d="M12 18l4 4h-6ZM28 18l2 4h-6ZM13 27c4 3 10 3 14 0l-3 1-1 2-2-2-2 2-2-2Z" fill="#1e1b4b" />
    </svg>
  );
}
