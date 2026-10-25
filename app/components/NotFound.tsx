import {Form} from 'react-router';
import {Icon} from '~/components/brand/Icons';
import {Button, ChipLink, Eyebrow} from '~/components/ui';
import {SHELVES} from '~/lib/book';

/** «Esta página se perdió en el sótano.» (404) y errores inesperados. */
export function NotFound({status = 404, detail}: {status?: number; detail?: string}) {
  const lost = status === 404;
  return (
    <div className="mx-auto box-border flex max-w-[980px] flex-col gap-7 px-4 pb-24 pt-2 md:px-6">
      <div aria-hidden="true" className="flex items-center justify-center gap-1 font-serif text-[120px] font-black leading-none text-night-purple md:text-[200px]">
        {lost ? (
          <>
            4
            <Icon name="ghost" strokeWidth={1.6} className="size-[0.9em] text-witch" />4
          </>
        ) : (
          <Icon name="ghost" strokeWidth={1.6} className="size-[0.9em] text-witch" />
        )}
      </div>
      <section className="flex flex-col items-center gap-3.5 text-center">
        <Eyebrow>{lost ? 'Error 404' : `Error ${status}`}</Eyebrow>
        <h1 className="m-0 font-serif text-[32px] font-black leading-[1.1] md:text-5xl">
          {lost ? 'Esta página se perdió en el sótano.' : 'Algo crujió donde no debía.'}
        </h1>
        <p className="m-0 max-w-[560px] text-base leading-relaxed text-slate md:text-lg">
          {lost
            ? 'Quizá la movimos de estante o nunca existió. Búscala, o vuelve a donde hay luz.'
            : 'No pudimos cargar esta página. Inténtalo de nuevo en un momento.'}
        </p>
        {detail && !lost ? <p className="m-0 text-sm text-mist">{detail}</p> : null}
      </section>
      <Form method="get" action="/search" role="search" className="mx-auto flex min-h-[60px] w-full max-w-[680px] items-center gap-2 rounded-full border-[1.5px] border-witch bg-white py-1.5 pl-5 pr-1.5">
        <span className="flex text-witch">
          <Icon name="search" size={20} />
        </span>
        <label htmlFor="nf-q" className="sr-only">
          Buscar en la buhardilla
        </label>
        <input id="nf-q" name="q" type="search" placeholder="Busca un título o autor" className="min-h-[46px] min-w-0 flex-1 border-0 bg-transparent font-sans text-[17px] text-midnight outline-none" />
        <button type="submit" className="btn-main btn-primary min-h-[46px] flex-none cursor-pointer rounded-full border-0 px-6 font-sans text-[15px] font-extrabold">
          Buscar
        </button>
      </Form>
      <div className="flex flex-wrap justify-center gap-2">
        {SHELVES.filter((s) => s.handle !== 'novedades').map((s) => (
          <ChipLink key={s.handle} to={`/collections/${s.handle}`}>
            {s.title}
          </ChipLink>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Button to="/" className="max-sm:w-full">
          Volver al inicio
        </Button>
        <Button to="/ayuda" variant="outline" className="max-sm:w-full">
          Ir a la ayuda
        </Button>
      </div>
    </div>
  );
}
