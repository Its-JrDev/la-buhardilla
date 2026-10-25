import {createContext, type ReactNode, useContext, useEffect, useId, useMemo, useRef, useState} from 'react';
import {useLocation} from 'react-router';
import {Icon} from '~/components/brand/Icons';

type AsideType = 'search' | 'cart' | 'mobile' | 'closed';
type AsideContextValue = {
  type: AsideType;
  open: (mode: AsideType) => void;
  close: () => void;
};

/**
 * Panel lateral con velo oscuro. `cart` entra por la derecha, `mobile` por la izquierda
 * y `search` cae desde arriba.
 */
export function Aside({
  children,
  heading,
  eyebrow,
  type,
  bare = false,
}: {
  children?: ReactNode;
  type: Exclude<AsideType, 'closed'>;
  heading: ReactNode;
  eyebrow?: ReactNode;
  /** Sin cabecera propia (el contenido trae la suya). */
  bare?: boolean;
}) {
  const {type: activeType, close} = useAside();
  const expanded = type === activeType;
  const id = useId();
  const panel = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!expanded) return;
    const ac = new AbortController();
    document.addEventListener('keydown', (e) => e.key === 'Escape' && close(), {signal: ac.signal});
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panel.current?.focus();
    return () => {
      ac.abort();
      document.body.style.overflow = prev;
    };
  }, [close, expanded]);

  const side =
    type === 'cart'
      ? 'right-0 top-0 h-dvh w-full sm:w-[400px] ' + (expanded ? 'translate-x-0' : 'translate-x-full')
      : type === 'mobile'
        ? 'left-0 top-0 h-dvh w-[86%] max-w-[380px] ' + (expanded ? 'translate-x-0' : '-translate-x-full')
        : 'inset-x-0 top-0 max-h-[85dvh] ' + (expanded ? 'translate-y-0' : '-translate-y-full');

  return (
    <div
      className={`fixed inset-0 z-50 transition-[visibility] ${expanded ? 'visible' : 'invisible delay-300'}`}
      aria-hidden={!expanded}
    >
      <button
        type="button"
        tabIndex={-1}
        aria-label="Cerrar"
        onClick={close}
        className={`absolute inset-0 cursor-default border-0 bg-midnight/55 transition-opacity duration-300 ${expanded ? 'opacity-100' : 'opacity-0'}`}
      />
      <aside
        ref={panel}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={id}
        className={`absolute flex flex-col bg-ghost shadow-[-24px_0_48px_-24px_rgba(15,23,42,.6)] outline-none transition-transform duration-300 ease-out ${side}`}
      >
        {bare ? (
          <h2 id={id} className="sr-only">
            {heading}
          </h2>
        ) : (
          <header className="flex items-center justify-between gap-3 border-b border-dashed border-witch-light py-3 pl-5 pr-2.5">
            <div className="flex flex-col gap-0.5">
              {eyebrow ? <span className="eyebrow text-xs">{eyebrow}</span> : null}
              <h2 id={id} className="m-0 font-serif text-[22px] font-black">
                {heading}
              </h2>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Cerrar"
              className="flex size-11 flex-none cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-midnight hover:bg-spill"
            >
              <Icon name="x" size={22} />
            </button>
          </header>
        )}
        {children}
      </aside>
    </div>
  );
}

const AsideContext = createContext<AsideContextValue | null>(null);

Aside.Provider = function AsideProvider({children}: {children: ReactNode}) {
  const [type, setType] = useState<AsideType>('closed');
  const {pathname} = useLocation();
  useEffect(() => setType('closed'), [pathname]);
  const value = useMemo(() => ({type, open: setType, close: () => setType('closed')}), [type]);
  return <AsideContext.Provider value={value}>{children}</AsideContext.Provider>;
};

export function useAside() {
  const aside = useContext(AsideContext);
  if (!aside) throw new Error('useAside must be used within an AsideProvider');
  return aside;
}
