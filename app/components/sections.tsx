import type {ReactNode} from 'react';
import {Icon, type IconName} from '~/components/brand/Icons';

export function Tiles({items}: {items: Array<{icon: IconName; title: string; text: ReactNode}>}) {
  return (
    <ul className="m-0 flex list-none flex-wrap gap-4 p-0">
      {items.map((t) => (
        <li key={t.title} className="flex min-w-0 flex-[1_1_240px] flex-col gap-2.5 rounded-[22px] bg-white p-[22px]">
          <span className="flex size-12 items-center justify-center rounded-full bg-spill text-drip">
            <Icon name={t.icon} size={22} />
          </span>
          <span className="font-serif text-[19px] font-black">{t.title}</span>
          <span className="text-[15px] leading-relaxed text-ash">{t.text}</span>
        </li>
      ))}
    </ul>
  );
}
