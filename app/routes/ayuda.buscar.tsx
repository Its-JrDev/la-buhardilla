import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/ayuda.buscar';
import {HelpContact} from '~/components/help';
import {FaqItem, PageHead} from '~/components/ui';
import {HELP_TOPICS} from '~/lib/help';

export const meta: Route.MetaFunction = () => [{title: 'Buscar en la ayuda | La Buhardilla'}];

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export function loader({request}: Route.LoaderArgs) {
  const q = (new URL(request.url).searchParams.get('q') ?? '').trim();
  const words = norm(q).split(/\s+/).filter((w) => w.length > 2);
  const results = words.length
    ? HELP_TOPICS.flatMap((t) => t.faqs.map((f) => ({...f, topic: t.title, handle: t.handle}))).filter((f) =>
        words.some((w) => norm(`${f.q} ${f.a} ${f.topic}`).includes(w)),
      )
    : [];
  return {q, results};
}

export default function AyudaBuscar() {
  const {q, results} = useLoaderData<typeof loader>();
  return (
    <div className="mx-auto box-border flex max-w-[980px] flex-col gap-7 px-4 pb-24 md:px-6">
      <PageHead crumbs={[{label: 'Ayuda', to: '/ayuda'}, {label: 'Buscar'}]} eyebrow={`${results.length} respuestas`} title={q ? `«${q}»` : 'Busca tu duda'} />
      {results.length ? (
        <div className="flex flex-col gap-3">
          {results.map((f, i) => (
            <FaqItem key={f.q} question={f.q} answer={f.a} open={i === 0} />
          ))}
        </div>
      ) : (
        <p className="m-0 text-[17px] text-ash">
          No encontramos esa duda. Mira los <Link to="/ayuda">temas de ayuda</Link> o escríbenos.
        </p>
      )}
      <HelpContact />
    </div>
  );
}
