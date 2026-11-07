import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { asyncStorage } from './storage';
import { defaultWatchlist } from '@/data/instruments';

interface WatchlistState {
  symbols: string[];
  add: (symbol: string) => void;
  remove: (symbol: string) => void;
  toggle: (symbol: string) => void;
  has: (symbol: string) => boolean;
}

export const useWatchlist = create<WatchlistState>()(
  persist(
    (set, get) => ({
      symbols: defaultWatchlist,
      add: (symbol) => {
        if (!get().symbols.includes(symbol)) {
          set({ symbols: [symbol, ...get().symbols] });
        }
      },
      remove: (symbol) => set({ symbols: get().symbols.filter((s) => s !== symbol) }),
      toggle: (symbol) => (get().has(symbol) ? get().remove(symbol) : get().add(symbol)),
      has: (symbol) => get().symbols.includes(symbol),
    }),
    { name: 'brow-watchlist', storage: asyncStorage },
  ),
);
