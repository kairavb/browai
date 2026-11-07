import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { asyncStorage } from './storage';
import type { RiskTolerance, Segment } from '@/types';

interface PrefsState {
  hydrated: boolean;
  onboarded: boolean;
  name: string;
  markets: Segment[];
  risk: RiskTolerance;
  notificationsEnabled: boolean;
  setName: (name: string) => void;
  toggleMarket: (m: Segment) => void;
  setRisk: (r: RiskTolerance) => void;
  setNotifications: (v: boolean) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

export const usePrefs = create<PrefsState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      onboarded: false,
      name: 'Kairav',
      markets: ['India Equity', 'India F&O'],
      risk: 'Moderate',
      notificationsEnabled: false,
      setName: (name) => set({ name: name.trim() || 'Trader' }),
      toggleMarket: (m) => {
        const markets = get().markets;
        set({
          markets: markets.includes(m) ? markets.filter((x) => x !== m) : [...markets, m],
        });
      },
      setRisk: (risk) => set({ risk }),
      setNotifications: (notificationsEnabled) => set({ notificationsEnabled }),
      completeOnboarding: () => set({ onboarded: true }),
      resetOnboarding: () => set({ onboarded: false }),
    }),
    {
      name: 'brow-prefs',
      storage: asyncStorage,
      partialize: ({ onboarded, name, markets, risk, notificationsEnabled }) => ({
        onboarded,
        name,
        markets,
        risk,
        notificationsEnabled,
      }),
    },
  ),
);

// Mark hydration complete once persisted state is loaded.
usePrefs.persist?.onFinishHydration?.(() => usePrefs.setState({ hydrated: true }));
// Fallback in case storage is empty/instant.
if (usePrefs.persist?.hasHydrated?.()) {
  usePrefs.setState({ hydrated: true });
}
