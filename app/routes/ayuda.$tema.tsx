import {Link, NavLink, useLoaderData} from 'react-router';
import type {Route} from './+types/ayuda.$tema';
import {Icon} from '~/components/brand/Icons';
import {HelpContact} from '~/components/help';
import {Crumbs, Eyebrow, FaqItem} from '~/components/ui';
import {HELP_TOPICS, topicByHandle} from '~/lib/help';

export const meta: Route.MetaFunction = ({data}) => [{title: `${data?.topic.title ?? 'Ayuda'} | Ayuda | La Buhardilla`}];

export function loader({params}: Route.LoaderArgs) {
  const topic = topicByHandle(params.tema);
  if (!topic) throw new Response('Tema no encontrado', {status: 404});
  return {topic};
}

export default function AyudaTema() {
  const {topic} = useLoaderData<typeof loader>();
  const head = (
    <div className="flex flex-col gap-2.5">
      <Eyebrow>Tema · {topic.faqs.length} preguntas</Eyebrow>
      <h1 className="m-0 font-serif text-[32px] font-black leading-[1.1] md:text-[46px]">{topic.title}</h1>
      <p className="m-0 max-w-[620px] text-base leading-relaxed text-slate md:text-lg">{topic.lead}</p>
    </div>
  );
  return (
    <div className="mx-auto box-border flex max-w-[1280px] items-start gap-12 px-4 pb-24 md:px-6">
      <aside className="sticky top-6 hidden w-[300px] flex-none flex-col gap-1.5 rounded-3xl border-[1.5px] border-veil bg-white p-3.5 md:flex">
        <span className="eyebrow px-3.5 pb-2 pt-1.5 text-xs">Temas</span>
        <nav aria-label="Temas de ayuda" className="flex flex-col gap-0.5">
          {HELP_TOPICS.map((t) => (
            <NavLink
              key={t.handle}
              to={`/ayuda/${t.handle}`}
              className={({isActive}) =>
                `flex min-h-12 items-center gap-3 rounded-2xl px-3.5 text-[15px] font-extrabold no-underline ${isActive ? 'bg-midnight text-pumpkin-light hover:text-pumpkin-light' : 'text-midnight hover:bg-spill hover:text-midnight'}`
              }
            >
              {({isActive}) => (
                <>
                  <span className={`flex ${isActive ? 'text-pumpkin-light' : 'text-drip'}`}>
                    <Icon name={t.icon} size={19} />
                  </span>
                  <span className="flex-1">{t.title}</span>
                  <span className={`text-[13px] ${isActive ? 'text-pumpkin-soft' : 'text-mist'}`}>{t.faqs.length}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col gap-7">
        <Crumbs items={[{label: 'Ayuda', to: '/ayuda'}, {label: topic.title}]} />
        {head}
        <nav aria-label="Temas de ayuda" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1.5 md:hidden">
          {HELP_TOPICS.map((t) => {
            const on = t.handle === topic.handle;
            return (
              <Link
                key={t.handle}
                to={`/ayuda/${t.handle}`}
                aria-current={on ? 'page' : undefined}
                className={`inline-flex min-h-[42px] flex-none items-center gap-2 rounded-full px-4 text-sm font-extrabold no-underline ${on ? 'bg-midnight text-pumpkin-light' : 'border-[1.5px] border-witch-light bg-white text-midnight'}`}
              >
                <Icon name={t.icon} size={16} />
                {t.title}
              </Link>
            );
          })}
        </nav>
        <div className="flex flex-col gap-3">
          {topic.faqs.map((f, i) => (
            <FaqItem key={f.q} question={f.q} answer={f.a} open={i === 0} />
          ))}
        </div>
        <div className="mt-7">
          <HelpContact />
        </div>
      </div>
    </div>
  );
}
