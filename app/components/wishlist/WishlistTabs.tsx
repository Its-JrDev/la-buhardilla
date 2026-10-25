import {useState} from 'react';
import {Icon} from '~/components/brand/Icons';
import {buttonClass} from '~/components/ui';
import type {Wishlist} from '~/lib/wishlist';

interface WishlistTabsProps {
  lists: Wishlist[];
  activeListId: string;
  onSelect: (id: string) => void;
  onCreate: (name: string) => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onShare: (listId: string) => void;
}

export function WishlistTabs({
  lists,
  activeListId,
  onSelect,
  onCreate,
  onRename,
  onDelete,
  onShare,
}: WishlistTabsProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState('');

  const activeList = lists.find((l) => l.id === activeListId) ?? lists[0];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newListName.trim()) {
      onCreate(newListName.trim());
      setNewListName('');
      setIsCreating(false);
    }
  };

  const startRenaming = () => {
    if (!activeList) return;
    setRenameValue(activeList.name);
    setIsRenaming(true);
  };

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (renameValue.trim() && activeList) {
      onRename(activeList.id, renameValue.trim());
      setIsRenaming(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Barra de pestañas */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dashed border-witch-light pb-4">
        <div className="no-scrollbar -mx-4 flex items-center gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
          {lists.map((list) => {
            const isActive = list.id === activeListId;
            return (
              <button
                key={list.id}
                type="button"
                onClick={() => onSelect(list.id)}
                className={`inline-flex min-h-[42px] cursor-pointer items-center gap-2 rounded-full border px-4.5 text-sm font-extrabold transition-colors ${
                  isActive
                    ? 'border-midnight bg-midnight text-pumpkin-light'
                    : 'border-witch-light bg-white text-midnight hover:border-witch hover:bg-spill'
                }`}
              >
                <span>{list.name}</span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${
                    isActive ? 'bg-night text-pumpkin-light' : 'bg-spill text-ash'
                  }`}
                >
                  {list.handles.length}
                </span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="inline-flex min-h-[42px] cursor-pointer items-center gap-1.5 rounded-full border border-dashed border-witch-light bg-cream px-3.5 text-sm font-bold text-witch hover:border-witch hover:bg-spill"
          >
            <Icon name="plus" size={16} />
            <span>Nueva lista</span>
          </button>
        </div>

        {/* Acciones para la lista activa */}
        {activeList && (
          <div className="flex items-center gap-2 text-sm">
            <button
              type="button"
              onClick={() => onShare(activeList.id)}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-witch-light bg-white px-3.5 py-1.5 font-bold text-midnight hover:bg-spill"
              title="Compartir esta lista mediante enlace único"
            >
              <Icon name="share" size={15} className="text-witch" />
              <span>Compartir</span>
            </button>

            <button
              type="button"
              onClick={startRenaming}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-transparent px-2.5 py-1.5 font-bold text-ash hover:border-witch-light hover:bg-spill hover:text-midnight"
              title="Renombrar lista"
            >
              <Icon name="edit" size={15} />
              <span className="hidden sm:inline">Renombrar</span>
            </button>

            {!activeList.isDefault && lists.length > 1 && (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`¿Deseas eliminar la lista «${activeList.name}»? Los libros seguirán en tu tienda.`)) {
                    onDelete(activeList.id);
                  }
                }}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-transparent px-2.5 py-1.5 font-bold text-ash hover:bg-spill hover:text-red-700"
                title="Eliminar lista"
              >
                <Icon name="trash" size={15} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Formulario modal/inline para crear nueva lista */}
      {isCreating && (
        <form
          onSubmit={handleCreateSubmit}
          className="flex flex-wrap items-center gap-3 rounded-2xl border border-dashed border-witch-light bg-white p-4 animate-in fade-in"
        >
          <div className="min-w-0 flex-1">
            <label htmlFor="new-list-name" className="sr-only">
              Nombre de la nueva lista
            </label>
            <input
              id="new-list-name"
              type="text"
              placeholder="Ej. Por leer, Regalos de Navidad, Terror clásico…"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              className="w-full rounded-xl border border-witch-light bg-cream px-3.5 py-2 text-sm font-medium text-midnight outline-hidden focus:border-witch"
            />
          </div>
          <button type="submit" disabled={!newListName.trim()} className={buttonClass({size: 'sm'})}>
            Crear lista
          </button>
          <button
            type="button"
            onClick={() => {
              setIsCreating(false);
              setNewListName('');
            }}
            className="cursor-pointer border-0 bg-transparent px-3 py-2 text-sm font-bold text-ash hover:text-midnight"
          >
            Cancelar
          </button>
        </form>
      )}

      {/* Formulario modal/inline para renombrar lista */}
      {isRenaming && (
        <form
          onSubmit={handleRenameSubmit}
          className="flex flex-wrap items-center gap-3 rounded-2xl border border-dashed border-witch-light bg-white p-4 animate-in fade-in"
        >
          <div className="min-w-0 flex-1">
            <label htmlFor="rename-list-input" className="sr-only">
              Nuevo nombre de la lista
            </label>
            <input
              id="rename-list-input"
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              className="w-full rounded-xl border border-witch-light bg-cream px-3.5 py-2 text-sm font-medium text-midnight outline-hidden focus:border-witch"
            />
          </div>
          <button type="submit" disabled={!renameValue.trim()} className={buttonClass({size: 'sm'})}>
            Guardar nombre
          </button>
          <button
            type="button"
            onClick={() => setIsRenaming(false)}
            className="cursor-pointer border-0 bg-transparent px-3 py-2 text-sm font-bold text-ash hover:text-midnight"
          >
            Cancelar
          </button>
        </form>
      )}
    </div>
  );
}
