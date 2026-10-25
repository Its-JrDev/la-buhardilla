import {useState} from 'react';
import {Icon} from '~/components/brand/Icons';
import {buttonClass} from '~/components/ui';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  listName: string;
  shareUrl: string;
  itemCount: number;
}

export function ShareModal({isOpen, onClose, listName, shareUrl, itemCount}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const input = document.createElement('input');
        input.value = shareUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* Fallback si el navegador restringe clipboard */
    }
  };

  const whatsappText = encodeURIComponent(
    `¡Hola! Te comparto mi selección de libros «${listName}» de La Buhardilla:\n${shareUrl}`,
  );
  const whatsappUrl = `https://api.whatsapp.com/send?text=${whatsappText}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in">
      <button
        type="button"
        aria-label="Cerrar ventana"
        onClick={onClose}
        className="fixed inset-0 cursor-default bg-black/60 backdrop-blur-xs"
        tabIndex={-1}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-title"
        className="relative z-10 w-full max-w-lg rounded-3xl border border-witch-light bg-cream p-6 shadow-2xl md:p-8"
      >
        <div className="flex items-start justify-between gap-4 border-b border-dashed border-witch-light pb-4">
          <div>
            <span className="eyebrow">Enlace para compartir</span>
            <h2 id="share-title" className="mt-1 font-serif text-2xl font-black text-midnight">
              {listName}
            </h2>
            <p className="mt-1 text-sm text-ash">
              {itemCount} {itemCount === 1 ? 'libro seleccionado' : 'libros seleccionados'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-full p-2 text-ash hover:bg-spill hover:text-midnight"
            aria-label="Cerrar ventana"
          >
            <Icon name="x" size={20} />
          </button>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          <p className="text-sm leading-relaxed text-slate">
            Cualquier persona con este enlace podrá ver los libros de esta lista, añadirlos a su propia selección o
            guardarlos en su biblioteca.
          </p>

          <div className="flex items-center gap-2 rounded-2xl border border-witch-light bg-white p-2.5">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="min-w-0 flex-1 truncate border-0 bg-transparent px-2 text-sm font-medium text-midnight outline-hidden"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <button
              type="button"
              onClick={() => void handleCopy()}
              className={`flex-none ${buttonClass({size: 'sm'})} ${
                copied ? 'bg-forest text-white hover:bg-forest' : ''
              }`}
            >
              <Icon name={copied ? 'check' : 'copy'} size={16} />
              {copied ? '¡Copiado!' : 'Copiar'}
            </button>
          </div>

          <div className="mt-2 flex flex-col gap-2.5 sm:flex-row">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex-1 ${buttonClass({size: 'sm', variant: 'outline'})}`}
            >
              <Icon name="share" size={16} />
              Compartir en WhatsApp
            </a>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-full border border-witch-light bg-transparent px-5 py-2.5 text-center text-sm font-extrabold text-midnight hover:bg-spill"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
