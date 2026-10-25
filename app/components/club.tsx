import {Icon} from '~/components/brand/Icons';
import type {ClubSession} from '~/lib/club';

export function CalendarLeaf({month, day, weekday, dark = false}: {month: string; day: string; weekday: string; dark?: boolean}) {
  return (
    <div className={`w-[104px] flex-none overflow-hidden rounded-2xl text-center shadow-[0_10px_24px_-14px_rgba(46,16,101,.55)] ${dark ? 'bg-night-purple' : 'bg-white'}`}>
      <div className="bg-drip py-1.5 text-xs font-extrabold tracking-[.14em] text-ghost">{month}</div>
      <div className={`px-0 pb-0.5 pt-2.5 font-serif text-[44px] font-black leading-none ${dark ? 'text-ghost' : 'text-midnight'}`}>{day}</div>
      <div className={`pb-2.5 text-[13px] font-bold ${dark ? 'text-pumpkin-soft' : 'text-pumpkin-dark'}`}>{weekday}</div>
    </div>
  );
}

/** Sesión del club como boleto: talón con la fecha, línea punteada y mini portada. */
export function SessionCard({session, seats, tag}: {session: ClubSession; seats?: string; tag?: string}) {
  const next = session.status === 'next';
  const tbd = session.status === 'tbd';
  const ink = next ? 'text-ghost' : 'text-midnight';
  const accent = next ? 'text-pumpkin-soft' : 'text-pumpkin-dark';
  const muted = next ? 'text-veil' : 'text-ash';
  return (
    <article
      className={`flex items-stretch overflow-hidden rounded-[22px] border-[1.5px] ${
        next ? 'border-night bg-night shadow-[0_18px_36px_-24px_rgba(30,27,75,.8)]' : 'border-veil bg-white'
      } ${ink}`}
    >
      <div className={`flex w-[104px] flex-none flex-col items-center justify-center gap-0.5 border-r-2 border-dashed py-4 ${next ? 'border-[#4c1d95]' : 'border-veil'}`}>
        <span className={`text-xs font-extrabold tracking-[.14em] ${accent}`}>{session.month}</span>
        <span className="font-serif text-[40px] font-black leading-none">{session.day}</span>
        <span className={`text-[13px] font-bold ${muted}`}>{session.weekday}</span>
      </div>
      <div className="flex min-w-0 flex-1 items-center gap-4 px-[18px] py-4">
        <span
          aria-hidden="true"
          className="flex aspect-[2/3] w-11 flex-none items-center justify-center rounded-[2px_4px_4px_2px] font-serif text-lg font-black"
          style={{
            background: tbd ? '#f3e8ff' : session.cover?.bg,
            color: tbd ? '#7e22ce' : session.cover?.ink,
            boxShadow: '3px 5px 10px -4px rgba(46,16,101,.5)',
          }}
        >
          {tbd ? '?' : <span className="m-1 block size-[calc(100%-8px)] rounded-[10px_10px_2px_2px] border border-dashed border-current" />}
        </span>
        <span className="flex min-w-0 flex-col gap-1">
          <span className={`text-xs font-extrabold uppercase tracking-[.12em] ${accent}`}>{tag ?? session.tag}</span>
          <span className="font-serif text-xl font-black italic leading-tight">{session.book}</span>
          <span className={`text-sm ${muted}`}>{session.author}</span>
          {tbd ? null : (
            <span className={`flex flex-wrap gap-x-3.5 gap-y-1 text-sm ${next ? 'text-veil' : 'text-slate'}`}>
              <span className="inline-flex items-center gap-1.5">
                <Icon name="clock" size={16} className={next ? 'text-pumpkin-soft' : 'text-witch'} />
                23:00 h
              </span>
              {seats ? (
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="users" size={16} className={next ? 'text-pumpkin-soft' : 'text-witch'} />
                  {seats}
                </span>
              ) : null}
            </span>
          )}
        </span>
      </div>
    </article>
  );
}
