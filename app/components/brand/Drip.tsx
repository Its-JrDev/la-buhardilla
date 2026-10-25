import {DRIP_PATH} from './drip-path';

/**
 * El goteo morado que cae del header (o sube hacia el footer con `flip`).
 */
export function Drip({
  fill = '#6b21a8',
  bg,
  flip = false,
  compact = false,
  className = '',
}: {
  fill?: string;
  bg?: string;
  flip?: boolean;
  compact?: boolean;
  className?: string;
}) {
  return (
    <div className={`leading-none ${className}`} aria-hidden="true">
      <svg
        className="-my-px block w-full"
        style={{height: compact ? 56 : 'clamp(50px, 7.65vw, 110px)'}}
        viewBox="270 0 1440 110"
        preserveAspectRatio="xMidYMin slice"
      >
        {bg ? <rect x="270" width="1440" height="110" fill={bg} /> : null}
        <path
          fill={fill}
          transform={flip ? 'translate(1980 0) scale(-1 1)' : undefined}
          d={DRIP_PATH}
        />
      </svg>
    </div>
  );
}
