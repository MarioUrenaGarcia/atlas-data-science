import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type ThemePreference = 'sistema' | 'claro' | 'oscuro';
export type RoadmapView = 'diagrama' | 'lista';

interface PreferencesState {
  theme: ThemePreference;
  roadmapView: RoadmapView;
  setTheme: (theme: ThemePreference) => void;
  setRoadmapView: (view: RoadmapView) => void;
}

export const PREFERENCES_STORAGE_KEY = 'atlas-preferencias';

export const usePreferences = create<PreferencesState>()(
  persist(
    (set) => ({
      theme: 'sistema',
      roadmapView: 'diagrama',
      setTheme: (theme) => set({ theme }),
      setRoadmapView: (roadmapView) => set({ roadmapView }),
    }),
    {
      name: PREFERENCES_STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export function resolveTheme(preference: ThemePreference, prefersDark: boolean): 'light' | 'dark' {
  if (preference === 'claro') return 'light';
  if (preference === 'oscuro') return 'dark';
  return prefersDark ? 'dark' : 'light';
}
