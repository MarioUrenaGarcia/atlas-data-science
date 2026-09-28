import { create } from 'zustand';

interface UiState {
  searchOpen: boolean;
  searchInitialQuery: string;
  openSearch: (query?: string) => void;
  closeSearch: () => void;
}

export const useUi = create<UiState>()((set) => ({
  searchOpen: false,
  searchInitialQuery: '',
  openSearch: (query = '') => set({ searchOpen: true, searchInitialQuery: query }),
  closeSearch: () => set({ searchOpen: false }),
}));
