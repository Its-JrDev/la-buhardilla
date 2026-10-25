import {useCallback, useEffect, useState} from 'react';

export interface Wishlist {
  id: string;
  name: string;
  handles: string[];
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WishlistState {
  lists: Wishlist[];
  activeListId: string;
}

export interface SharePayload {
  n: string; // List name
  h: string[]; // Handles
}

const STORAGE_KEY = 'buhardilla:wishlists';
const OLD_STORAGE_KEY = 'buhardilla:guardados';
const EVENT_NAME = 'buhardilla:wishlists';

/**
 * Convierte un objeto a un token URL-safe usando Base64 estándar compatible
 * con navegador, Cloudflare Workers / Oxygen y Node.
 */
export function encodeShareToken(payload: SharePayload): string {
  try {
    const json = JSON.stringify(payload);
    let base64 = '';
    if (typeof btoa === 'function') {
      base64 = btoa(unescape(encodeURIComponent(json)));
    } else if (typeof Buffer !== 'undefined') {
      base64 = Buffer.from(json, 'utf-8').toString('base64');
    }
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch {
    return '';
  }
}

/**
 * Decodifica un token URL-safe a su payload de lista.
 */
export function decodeShareToken(token: string): SharePayload | null {
  try {
    let base64 = token.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    let json = '';
    if (typeof atob === 'function') {
      json = decodeURIComponent(escape(atob(base64)));
    } else if (typeof Buffer !== 'undefined') {
      json = Buffer.from(base64, 'base64').toString('utf-8');
    }
    const parsed = JSON.parse(json) as unknown;
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'h' in parsed &&
      Array.isArray((parsed as SharePayload).h)
    ) {
      const p = parsed as SharePayload;
      return {
        n: typeof p.n === 'string' && p.n.trim() ? p.n.trim() : 'Lista compartida',
        h: p.h.filter((x): x is string => typeof x === 'string' && /^[a-z0-9-]+$/.test(x)).slice(0, 50),
      };
    }
    return null;
  } catch {
    return null;
  }
}

function defaultState(): WishlistState {
  const now = new Date().toISOString();
  return {
    lists: [
      {
        id: 'default',
        name: 'Mis favoritos',
        handles: [],
        isDefault: true,
        createdAt: now,
        updatedAt: now,
      },
    ],
    activeListId: 'default',
  };
}

export function readWishlistState(): WishlistState {
  if (typeof window === 'undefined') return defaultState();
  try {
    // 1. Intentar leer estado moderno
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as WishlistState;
      if (Array.isArray(parsed?.lists) && parsed.lists.length > 0) {
        return parsed;
      }
    }

    // 2. Migración transparente de guardados antiguos ('buhardilla:guardados')
    const oldRaw = window.localStorage.getItem(OLD_STORAGE_KEY);
    const oldHandles = oldRaw ? (JSON.parse(oldRaw) as unknown) : null;
    const initial = defaultState();
    if (Array.isArray(oldHandles) && oldHandles.length > 0) {
      initial.lists[0].handles = oldHandles.filter((x): x is string => typeof x === 'string');
      writeWishlistState(initial);
      // Mantener copia o limpiar si se desea; mantenemos sincronizada
    }
    return initial;
  } catch {
    return defaultState();
  }
}

export function writeWishlistState(state: WishlistState) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    // Sincronizar también la clave antigua para cualquier script externo
    const allHandles = Array.from(new Set(state.lists.flatMap((l) => l.handles)));
    window.localStorage.setItem(OLD_STORAGE_KEY, JSON.stringify(allHandles));
  } catch {
    /* Cuota o almacenamiento privado */
  }
  window.dispatchEvent(new Event(EVENT_NAME));
}

function subscribe(cb: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', cb);
  window.addEventListener(EVENT_NAME, cb);
  return () => {
    window.removeEventListener('storage', cb);
    window.removeEventListener(EVENT_NAME, cb);
  };
}

export function useWishlist() {
  const [state, setState] = useState<WishlistState>(defaultState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setState(readWishlistState());
    setReady(true);
    sync();
    return subscribe(sync);
  }, []);

  const activeList = state.lists.find((l) => l.id === state.activeListId) ?? state.lists[0] ?? defaultState().lists[0];
  const allHandles = Array.from(new Set(state.lists.flatMap((l) => l.handles)));

  const setActiveListId = useCallback((id: string) => {
    setState((prev) => {
      if (prev.lists.some((l) => l.id === id)) {
        const next = {...prev, activeListId: id};
        writeWishlistState(next);
        return next;
      }
      return prev;
    });
  }, []);

  const createList = useCallback((name: string) => {
    const cleanName = name.trim();
    if (!cleanName) return null;
    const now = new Date().toISOString();
    const id = `list_${Date.now().toString(36)}`;
    const newList: Wishlist = {
      id,
      name: cleanName,
      handles: [],
      createdAt: now,
      updatedAt: now,
    };
    setState((prev) => {
      const next: WishlistState = {
        lists: [...prev.lists, newList],
        activeListId: id,
      };
      writeWishlistState(next);
      return next;
    });
    return id;
  }, []);

  const renameList = useCallback((id: string, name: string) => {
    const cleanName = name.trim();
    if (!cleanName) return;
    setState((prev) => {
      const next: WishlistState = {
        ...prev,
        lists: prev.lists.map((l) =>
          l.id === id ? {...l, name: cleanName, updatedAt: new Date().toISOString()} : l,
        ),
      };
      writeWishlistState(next);
      return next;
    });
  }, []);

  const deleteList = useCallback((id: string) => {
    setState((prev) => {
      const target = prev.lists.find((l) => l.id === id);
      if (!target || target.isDefault || prev.lists.length <= 1) return prev;
      const remaining = prev.lists.filter((l) => l.id !== id);
      const next: WishlistState = {
        lists: remaining,
        activeListId: prev.activeListId === id ? remaining[0].id : prev.activeListId,
      };
      writeWishlistState(next);
      return next;
    });
  }, []);

  const addItem = useCallback((handle: string, targetListId?: string) => {
    setState((prev) => {
      const destId = targetListId ?? prev.activeListId;
      const nextLists = prev.lists.map((l) => {
        if (l.id === destId) {
          if (l.handles.includes(handle)) return l;
          return {
            ...l,
            handles: [...l.handles, handle],
            updatedAt: new Date().toISOString(),
          };
        }
        return l;
      });
      const next: WishlistState = {...prev, lists: nextLists};
      writeWishlistState(next);
      return next;
    });
  }, []);

  const removeItem = useCallback((handle: string, fromListId?: string) => {
    setState((prev) => {
      const nextLists = prev.lists.map((l) => {
        if (!fromListId || l.id === fromListId) {
          if (!l.handles.includes(handle)) return l;
          return {
            ...l,
            handles: l.handles.filter((h) => h !== handle),
            updatedAt: new Date().toISOString(),
          };
        }
        return l;
      });
      const next: WishlistState = {...prev, lists: nextLists};
      writeWishlistState(next);
      return next;
    });
  }, []);

  const moveItem = useCallback((handle: string, fromListId: string, toListId: string) => {
    if (fromListId === toListId) return;
    setState((prev) => {
      const nextLists = prev.lists.map((l) => {
        if (l.id === fromListId) {
          return {
            ...l,
            handles: l.handles.filter((h) => h !== handle),
            updatedAt: new Date().toISOString(),
          };
        }
        if (l.id === toListId) {
          if (l.handles.includes(handle)) return l;
          return {
            ...l,
            handles: [...l.handles, handle],
            updatedAt: new Date().toISOString(),
          };
        }
        return l;
      });
      const next: WishlistState = {...prev, lists: nextLists};
      writeWishlistState(next);
      return next;
    });
  }, []);

  const toggle = useCallback((handle: string, listId?: string) => {
    const current = readWishlistState();
    const destId = listId ?? current.activeListId;
    const target = current.lists.find((l) => l.id === destId);
    if (target?.handles.includes(handle)) {
      removeItem(handle, destId);
    } else {
      addItem(handle, destId);
    }
  }, [addItem, removeItem]);

  const importList = useCallback((payload: {name: string; handles: string[]}) => {
    const cleanName = payload.name.trim() || 'Lista compartida';
    const now = new Date().toISOString();
    const id = `list_${Date.now().toString(36)}`;
    const newList: Wishlist = {
      id,
      name: cleanName,
      handles: Array.from(new Set(payload.handles)),
      createdAt: now,
      updatedAt: now,
    };
    setState((prev) => {
      const next: WishlistState = {
        lists: [...prev.lists, newList],
        activeListId: id,
      };
      writeWishlistState(next);
      return next;
    });
    return id;
  }, []);

  const getShareUrl = useCallback((listId?: string): string => {
    const list = state.lists.find((l) => l.id === (listId ?? state.activeListId)) ?? activeList;
    const token = encodeShareToken({n: list.name, h: list.handles});
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/wishlist/${token}`;
    }
    return `/wishlist/${token}`;
  }, [activeList, state.activeListId, state.lists]);

  return {
    ready,
    state,
    lists: state.lists,
    activeList,
    activeListId: state.activeListId,
    allHandles,
    setActiveListId,
    createList,
    renameList,
    deleteList,
    addItem,
    removeItem,
    moveItem,
    toggle,
    hasItem: (handle: string, listId?: string) => {
      const target = state.lists.find((l) => l.id === (listId ?? state.activeListId));
      return Boolean(target?.handles.includes(handle));
    },
    isItemSaved: (handle: string) => allHandles.includes(handle),
    importList,
    getShareUrl,
  };
}
