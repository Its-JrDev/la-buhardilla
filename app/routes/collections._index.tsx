import type {Route} from './+types/collections._index';
import {Bookcase} from '~/components/Bookcase';
import {ChipLink, PageHead} from '~/components/ui';
import {SHELVES} from '~/lib/book';

export const meta: Route.MetaFunction = () => [{title: 'Estantes | La Buhardilla'}];

export default function Collections() {
  return (
    <div className="mx-auto box-border flex max-w-[1280px] flex-col gap-9 px-4 pb-24 md:px-6">
      <PageHead
        crumbs={[{label: 'Inicio', to: '/'}, {label: 'Estantes'}]}
        eyebrow="Estantes"
        title="Elige tu pesadilla"
        lead="Tres nichos del mismo librero, más las novedades y la vitrina de ediciones raras."
      />
      <div className="flex flex-wrap gap-2">
        <ChipLink to="/collections/all">Todo el catálogo</ChipLink>
        {SHELVES.map((s) => (
          <ChipLink key={s.handle} to={`/collections/${s.handle}`}>
            {s.title}
          </ChipLink>
        ))}
      </div>
      <Bookcase />
    </div>
  );
}
