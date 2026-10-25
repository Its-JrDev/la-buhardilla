import {useState} from 'react';
import {Icon} from '~/components/brand/Icons';
import {buttonClass} from '~/components/ui';
import type {Wishlist} from '~/lib/wishlist';

interface MoveItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookTitle: string;
  bookHandle: string;
  currentListId: string;
  lists: Wishlist[];
  onMove: (handle: string, fromListId: string, toListId: string) => void;
  onCopy: (handle: string, toListId: string) => void;
}

export function MoveItemModal({
  isOpen,
  onClose,
  bookTitle,
  bookHandle,
  currentListId,
  lists,
  onMove,
  onCopy,
}: MoveItemModalProps) {
  const [selectedListId, setSelectedListId] = useState(
    lists.find((l) => l.id !== currentListId)?.id ?? lists[0]?.id ?? '',
  );
  const [actionType, setActionType] = useState<'move' | 'copy'>('move');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListId) return;
    if (actionType === 'move') {
      onMove(bookHandle, currentListId, selectedListId);
    } else {
      onCopy(bookHandle, selectedListId);
    }
    onClose();
  };

  const otherLists = lists.filter((l) => l.id !== currentListId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in">
      <button
        type="button"
        aria-label="Cerrar modal"
        onClick={onClose}
        className="fixed inset-0 cursor-default bg-black/60 backdrop-blur-xs"
        tabIndex={-1}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="move-title"
        className="relative z-10 w-full max-w-md rounded-3xl border border-witch-light bg-cream p-6 shadow-2xl md:p-8"
      >
        <div className="flex items-start justify-between gap-4 border-b border-dashed border-witch-light pb-4">
          <div>
            <span className="eyebrow">Organizar en listas</span>
            <h2 id="move-title" className="mt-1 font-serif text-xl font-bold text-midnight">
              {bookTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-full p-2 text-ash hover:bg-spill hover:text-midnight"
            aria-label="Cerrar"
          >
            <Icon name="x" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
          <fieldset className="border-0 p-0 m-0">
            <legend className="text-xs font-bold uppercase tracking-wider text-ash">
              Selecciona la lista destino:
            </legend>
            <div className="mt-2 flex flex-col gap-2">
              {otherLists.map((l) => (
                <label
                  key={l.id}
                  htmlFor={`dest-list-${l.id}`}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition-colors ${
                    selectedListId === l.id
                      ? 'border-midnight bg-spill text-midnight'
                      : 'border-witch-light bg-white text-slate hover:bg-spill'
                  }`}
                >
                  <span className="font-bold">{l.name}</span>
                  <input
                    id={`dest-list-${l.id}`}
                    type="radio"
                    name="destList"
                    value={l.id}
                    checked={selectedListId === l.id}
                    onChange={() => setSelectedListId(l.id)}
                    className="accent-pumpkin-dark"
                  />
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="border-0 p-0 m-0 flex items-center gap-4 text-sm">
            <legend className="sr-only">Tipo de acción</legend>
            <label htmlFor="action-move" className="flex cursor-pointer items-center gap-2">
              <input
                id="action-move"
                type="radio"
                name="action"
                checked={actionType === 'move'}
                onChange={() => setActionType('move')}
                className="accent-pumpkin-dark"
              />
              <span className="font-medium">Mover (quitar de aquí)</span>
            </label>
            <label htmlFor="action-copy" className="flex cursor-pointer items-center gap-2">
              <input
                id="action-copy"
                type="radio"
                name="action"
                checked={actionType === 'copy'}
                onChange={() => setActionType('copy')}
                className="accent-pumpkin-dark"
              />
              <span className="font-medium">Copiar (mantener en ambas)</span>
            </label>
          </fieldset>

          <div className="mt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer border-0 bg-transparent px-4 py-2 text-sm font-bold text-ash hover:text-midnight"
            >
              Cancelar
            </button>
            <button type="submit" disabled={!selectedListId} className={buttonClass({size: 'sm'})}>
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
