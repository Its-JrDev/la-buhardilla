import {Link} from 'react-router';
import {Icon} from '~/components/brand/Icons';
import {buttonClass} from '~/components/ui';
import type {HelpTopic} from '~/lib/help';

export function HelpTopicCard({topic, compact = false}: {topic: HelpTopic; compact?: boolean}) {
  return (
    <Link
      to={`/ayuda/${topic.handle}`}
      prefetch="intent"
      className={`card-link box-border flex h-full gap-3.5 rounded-[22px] border-[1.5px] border-veil bg-white text-midnight no-underline hover:text-midnight ${
        compact ? 'items-center px-4 py-3.5' : 'flex-col p-[22px]'
      }`}
    >
      <span className="flex size-12 flex-none items-center justify-center rounded-full bg-spill text-drip">
        <Icon name={topic.icon} size={22} />
      </span>
      <span className={`flex min-w-0 flex-1 flex-col ${compact ? 'gap-0.5' : 'gap-2.5'}`}>
        <span className={`font-serif font-black leading-snug ${compact ? 'text-[17px]' : 'text-[19px]'}`}>{topic.title}</span>
        {compact ? null : <span className="flex-1 text-[15px] leading-relaxed text-ash">{topic.desc}</span>}
        <span className={`inline-flex items-center gap-1.5 font-extrabold text-pumpkin-dark ${compact ? 'text-[13px]' : 'text-sm'}`}>
          {topic.faqs.length} preguntas
          {compact ? null : <Icon name="arrow" size={16} />}
        </span>
      </span>
      {compact ? (
        <span className="flex flex-none text-witch">
          <Icon name="chev" size={20} />
        </span>
      ) : null}
    </Link>
  );
}

export function HelpContact() {
  return (
    <aside className="relative box-border flex flex-wrap items-center gap-x-6 gap-y-4 rounded-3xl border-[1.5px] border-witch-light bg-white px-6 py-[22px]">
      <span className="flex size-14 flex-none items-center justify-center rounded-full bg-spill text-drip">
        <Icon name="mail" size={26} />
      </span>
      <div className="flex min-w-0 flex-[1_1_280px] flex-col gap-1">
        <span className="eyebrow text-xs">¿Sigues a oscuras?</span>
        <h2 className="m-0 font-serif text-[22px] font-black leading-tight">No encontraste tu respuesta</h2>
        <p className="m-0 max-w-[540px] text-[15px] leading-relaxed text-ash">
          Escríbenos y alguien de la buhardilla te contesta. Si es sobre un pedido, ten a mano su número.
        </p>
      </div>
      <Link to="/contacto" className={`${buttonClass()} max-sm:w-full`}>
        Escríbenos <Icon name="arrow" size={18} />
      </Link>
    </aside>
  );
}
