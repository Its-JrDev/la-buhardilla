import {Link} from 'react-router';
import type {ComponentProps, ReactNode} from 'react';
import {Cobweb, Icon, type IconName} from '~/components/brand/Icons';

type Variant = 'primary' | 'accent' | 'outline' | 'outline-dark';

const LOOKS: Record<Variant, string> = {
  primary: 'bg-midnight text-pumpkin-light border-2 border-midnight btn-main btn-primary',
  accent: 'bg-pumpkin-light text-midnight border-2 border-pumpkin-light shadow-[0_6px_0_#9a3412] btn-main btn-accent',
  outline: 'bg-transparent text-midnight border-2 border-midnight hover:bg-midnight hover:text-pumpkin-light transition-colors',
  'outline-dark': 'bg-transparent text-ghost border-2 border-witch-light hover:bg-white/10 hover:text-ghost transition-colors',
};

export function buttonClass({
  variant = 'primary',
  size = 'md',
  full = false,
}: {variant?: Variant; size?: 'md' | 'sm'; full?: boolean} = {}) {
  return [
    'inline-flex items-center justify-center whitespace-nowrap rounded-full font-extrabold no-underline box-border cursor-pointer disabled:cursor-not-allowed disabled:opacity-60',
    size === 'sm' ? 'min-h-[46px] gap-2 px-[18px] text-[15px]' : 'min-h-[54px] gap-2.5 px-[30px] text-[17px]',
    LOOKS[variant],
    full ? 'w-full' : '',
  ].join(' ');
}

type BtnOwn = {
  variant?: Variant;
  size?: 'md' | 'sm';
  full?: boolean;
  icon?: 'arrow' | 'bag' | null;
  children: ReactNode;
};

function BtnInner({icon, children}: Pick<BtnOwn, 'icon' | 'children'>) {
  return (
    <>
      {icon === 'bag' ? <Icon name="bag" size={20} /> : null}
      {children}
      {icon === 'arrow' ? <Icon name="arrow" size={18} /> : null}
    </>
  );
}

/** Botón en píldora. Con `to` se comporta como enlace. */
export function Button({
  variant,
  size,
  full,
  icon,
  children,
  to,
  className = '',
  ...rest
}: BtnOwn & {to?: string; className?: string} & Omit<ComponentProps<'button'>, 'children'>) {
  const cls = `${buttonClass({variant, size, full})} ${className}`;
  if (to) {
    return (
      <Link to={to} prefetch="intent" className={cls} style={{color: undefined}}>
        <BtnInner icon={icon}>{children}</BtnInner>
      </Link>
    );
  }
  return (
    <button className={cls} type="button" {...rest}>
      <BtnInner icon={icon}>{children}</BtnInner>
    </button>
  );
}

export function Eyebrow({children, className = ''}: {children: ReactNode; className?: string}) {
  return <span className={`eyebrow ${className}`}>{children}</span>;
}

export function SectionHead({eyebrow, title, size = 'md'}: {eyebrow: ReactNode; title: ReactNode; size?: 'md' | 'sm'}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className={`m-0 font-serif font-black leading-[1.15] ${size === 'sm' ? 'text-[22px] md:text-[26px]' : 'text-[26px] md:text-[34px]'}`}>
        {title}
      </h2>
    </div>
  );
}

export function PageHead({
  eyebrow,
  title,
  lead,
  crumbs,
  center = false,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  crumbs?: Array<{label: string; to?: string}>;
  center?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-2.5 ${center ? 'items-center text-center' : ''}`}>
      {crumbs ? <Crumbs items={crumbs} /> : null}
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h1 className="m-0 font-serif text-[32px] font-black leading-[1.1] md:text-[46px]">{title}</h1>
      {lead ? <p className="m-0 max-w-[600px] text-base leading-relaxed text-slate md:text-lg">{lead}</p> : null}
    </div>
  );
}

export function Crumbs({items}: {items: Array<{label: string; to?: string}>}) {
  return (
    <nav aria-label="Ruta" className="flex flex-wrap gap-2 text-sm font-bold text-ash">
      {items.map((it, i) => (
        <span key={it.label} className="flex gap-2">
          {i ? <span aria-hidden="true">/</span> : null}
          {it.to ? (
            <Link to={it.to} className="no-underline">
              {it.label}
            </Link>
          ) : (
            <span aria-current="page">{it.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function Pill({children, tone = 'soft'}: {children: ReactNode; tone?: 'soft' | 'hot' | 'dark' | 'muted'}) {
  const t = {
    soft: 'bg-spill text-plum',
    hot: 'bg-pumpkin-light text-midnight',
    dark: 'bg-midnight text-pumpkin-soft',
    muted: 'bg-slate-200 text-slate',
  }[tone];
  return <span className={`inline-flex min-h-7 flex-none items-center rounded-full px-3 font-sans text-[13px] font-extrabold ${t}`}>{children}</span>;
}

export function ChipLink({to, children, sub}: {to: string; children: ReactNode; sub?: ReactNode}) {
  return (
    <Link
      to={to}
      prefetch="intent"
      className="inline-flex min-h-10 flex-none items-center gap-2 rounded-full bg-spill px-4 text-sm font-extrabold text-plum no-underline hover:bg-veil"
    >
      {children}
      {sub ? <span className="font-bold opacity-75">{sub}</span> : null}
    </Link>
  );
}

export function ChillRating({value, label = true}: {value: number; label?: boolean}) {
  return (
    <div role="img" aria-label={`Escala de escalofríos: ${value} de 5`} className="inline-flex items-center gap-2.5">
      {label ? <span className="text-[13px] font-extrabold text-ash">Escala de escalofríos</span> : null}
      <span className="inline-flex gap-0.5 text-witch">
        {[1, 2, 3, 4, 5].map((i) => (
          <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill={i <= value ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        ))}
      </span>
    </div>
  );
}

export function Field({
  label,
  error,
  hint,
  id,
  className = '',
  ...input
}: {label: string; error?: string | null; hint?: string} & ComponentProps<'input'>) {
  const fid = id ?? `f-${(input.name ?? label).toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '-')}`;
  const msg = error || hint;
  return (
    <div className={`flex min-w-0 flex-col gap-1.5 ${className}`}>
      <label htmlFor={fid} className="text-sm font-bold text-slate">
        {label}
      </label>
      <input id={fid} className="field-input" aria-invalid={error ? true : undefined} aria-describedby={msg ? `${fid}-msg` : undefined} {...input} />
      {msg ? (
        <span id={`${fid}-msg`} className={`pl-[18px] text-[13px] ${error ? 'font-bold text-pumpkin-dark' : 'text-mist'}`}>
          {msg}
        </span>
      ) : null}
    </div>
  );
}

export function TextArea({label, id, ...rest}: {label: string} & ComponentProps<'textarea'>) {
  const fid = id ?? `f-${(rest.name ?? 'msg').toString()}`;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={fid} className="text-sm font-bold text-slate">
        {label}
      </label>
      <textarea id={fid} rows={5} className="field-input" {...rest} />
    </div>
  );
}

/** Selector en píldoras (radios). */
export function OptionPills({
  legend,
  name,
  options,
  value,
  onChange,
}: {
  legend: string;
  name: string;
  options: Array<{value: string; label: ReactNode; sub?: ReactNode; disabled?: boolean}>;
  value?: string;
  onChange?: (v: string) => void;
}) {
  return (
    <fieldset className="m-0 flex flex-col border-0 p-0">
      <legend className="eyebrow mb-2.5 p-0 text-xs">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = o.value === value;
          return (
            <label
              key={o.value}
              className={`relative inline-flex min-h-12 cursor-pointer items-baseline gap-2 rounded-full border-[1.5px] px-[18px] py-3 ${
                on ? 'border-midnight bg-midnight text-pumpkin-light' : 'border-witch-light bg-white text-midnight'
              } ${o.disabled ? 'opacity-50 line-through' : ''} has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-pumpkin-light`}
            >
              <input
                type="radio"
                name={name}
                value={o.value}
                checked={onChange ? on : undefined}
                defaultChecked={onChange ? undefined : on}
                onChange={() => onChange?.(o.value)}
                className="absolute inset-0 m-0 cursor-pointer opacity-0"
              />
              <span className="text-[15px] font-extrabold">{o.label}</span>
              {o.sub ? <span className="text-sm font-bold opacity-80">{o.sub}</span> : null}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function Alert({title, children, tone = 'error'}: {title: ReactNode; children?: ReactNode; tone?: 'error' | 'info'}) {
  const err = tone === 'error';
  return (
    <div
      role={err ? 'alert' : 'status'}
      className={`flex items-start gap-3.5 rounded-[20px] border-2 bg-white px-[18px] py-4 ${err ? 'border-pumpkin-dark' : 'border-witch-light'}`}
    >
      <span className={`flex size-9 flex-none items-center justify-center rounded-full ${err ? 'bg-pumpkin-dark text-white' : 'bg-spill text-drip'}`}>
        <Icon name={err ? 'alert' : 'info'} size={20} strokeWidth={2.6} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5 pt-1.5">
        <span className="font-serif text-[17px] font-bold leading-snug">{title}</span>
        {children ? <span className="text-sm leading-relaxed text-slate">{children}</span> : null}
      </span>
    </div>
  );
}

export function EmptyState({
  title,
  message,
  cta = 'Explorar el catálogo',
  to = '/collections/all',
}: {
  title: string;
  message: string;
  cta?: string;
  to?: string;
}) {
  return (
    <section className="relative flex flex-col items-center gap-3.5 overflow-hidden rounded-3xl bg-white px-6 py-14 text-center">
      <Cobweb className="absolute left-0 top-0" />
      <Icon name="ghost" size={64} strokeWidth={1.6} className="text-witch" />
      <h2 className="m-0 font-serif text-[26px] font-black">{title}</h2>
      <p className="m-0 max-w-[360px] text-base leading-relaxed text-ash">{message}</p>
      <Button to={to}>{cta}</Button>
    </section>
  );
}

/** Banner en tarjeta con ícono, texto y acción (patrón del banner de invitado). */
export function Banner({
  icon,
  title,
  message,
  action,
  to,
  secondary,
}: {
  icon: IconName;
  title: ReactNode;
  message: ReactNode;
  action: string;
  to: string;
  secondary?: {label: string; to: string};
}) {
  return (
    <aside className="flex flex-wrap items-center gap-x-5 gap-y-3.5 rounded-[22px] border-[1.5px] border-witch-light bg-white px-5 py-[18px]">
      <span className="flex size-12 flex-none items-center justify-center rounded-full bg-spill text-drip">
        <Icon name={icon} size={22} />
      </span>
      <div className="flex min-w-0 flex-[1_1_260px] flex-col gap-0.5">
        <span className="font-serif text-[17px] font-bold leading-snug">{title}</span>
        <span className="text-sm leading-relaxed text-ash">{message}</span>
      </div>
      <div className="flex flex-[1_1_100%] flex-wrap items-center gap-x-4 gap-y-1.5 sm:flex-none">
        <Button to={to} size="sm" className="max-sm:w-full">
          {action}
        </Button>
        {secondary ? (
          <Link to={secondary.to} className="inline-flex min-h-11 items-center text-[15px] font-extrabold no-underline">
            {secondary.label}
          </Link>
        ) : null}
      </div>
    </aside>
  );
}

export function FaqItem({question, answer, open = false, feedback = true}: {question: string; answer: ReactNode; open?: boolean; feedback?: boolean}) {
  return (
    <details className="faq rounded-[22px] border-[1.5px] border-veil bg-white" open={open}>
      <summary className="flex min-h-16 cursor-pointer items-center gap-4 py-3.5 pl-[22px] pr-3.5">
        <span className="min-w-0 flex-1 font-serif text-[17px] font-bold leading-snug">{question}</span>
        <span className="faq-ic flex size-[38px] flex-none items-center justify-center rounded-full bg-spill text-drip" aria-hidden="true">
          <Icon name="plus" size={18} />
        </span>
      </summary>
      <div className="flex flex-col gap-4 px-[22px] pb-5">
        <p className="m-0 max-w-[660px] text-base leading-relaxed text-slate">{answer}</p>
        {feedback ? <FaqFeedback /> : null}
      </div>
    </details>
  );
}

function FaqFeedback() {
  return (
    <div className="dashed-top flex flex-wrap items-center gap-2 pt-3.5">
      <span className="mr-1.5 text-sm font-bold text-ash">¿Te sirvió?</span>
      {['Sí', 'No'].map((l) => (
        <button
          key={l}
          type="button"
          className="min-h-10 cursor-pointer rounded-full border-[1.5px] border-witch-light bg-white px-[18px] text-sm font-extrabold text-midnight hover:border-witch"
          onClick={(e) => {
            const box = e.currentTarget.parentElement;
            if (box) box.textContent = 'Gracias. Lo tomamos en cuenta.';
          }}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

export function DefinitionCard({title, rows}: {title: string; rows: Array<[ReactNode, ReactNode]>}) {
  return (
    <section className="card mx-auto box-border flex w-full max-w-[560px] flex-col gap-1.5 p-[22px] md:p-7">
      <h2 className="m-0 mb-1.5 font-serif text-[22px] font-black">{title}</h2>
      <dl className="m-0">
        {rows.map(([k, v], i) => (
          <div key={i} className="dashed-top flex items-baseline justify-between gap-4 py-3">
            <dt className="flex-none text-sm font-bold text-mist">{k}</dt>
            <dd className="m-0 text-right text-[15px] font-bold text-midnight">{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
