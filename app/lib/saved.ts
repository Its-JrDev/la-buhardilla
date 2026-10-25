import {useCallback} from 'react';
import {useWishlist} from '~/lib/wishlist';

/**
 * Capa de compatibilidad retrospectiva con los componentes existentes
 * (Header, MobileMenu, BookCard, BuyBox).
 * Consume por debajo el motor unificado de `useWishlist()`.
 */
export function useSaved() {
  const {ready, allHandles, activeList, toggle: toggleItem, removeItem} = useWishlist();

  // Para compatibilidad: `saved` refleja los handles de la lista activa o todos los guardados
  const saved = allHandles;

  const toggle = useCallback(
    (handle: string) => {
      toggleItem(handle, activeList.id);
    },
    [activeList.id, toggleItem],
  );

  const remove = useCallback(
    (handle: string) => {
      removeItem(handle);
    },
    [removeItem],
  );

  const isSaved = useCallback(
    (handle: string) => {
      return allHandles.includes(handle);
    },
    [allHandles],
  );

  return {
    saved,
    ready,
    isSaved,
    toggle,
    remove,
  };
}
