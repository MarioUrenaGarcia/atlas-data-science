import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type ConceptStatus = 'visto' | 'dominado';

export type ActiveRoute =
  { tipo: 'roadmap'; objetivo: string; desde?: string } | { tipo: 'ruta'; id: string };

interface ProgressState {
  conceptos: Record<string, ConceptStatus>;
  rutaActiva: ActiveRoute | null;
  setStatus: (id: string, status: ConceptStatus | null) => void;
  toggleStatus: (id: string, status: ConceptStatus) => void;
  setActiveRoute: (route: ActiveRoute | null) => void;
  replaceAll: (data: Pick<ProgressState, 'conceptos' | 'rutaActiva'>) => void;
  clear: () => void;
}

function without(
  record: Record<string, ConceptStatus>,
  key: string,
): Record<string, ConceptStatus> {
  return Object.fromEntries(Object.entries(record).filter(([entry]) => entry !== key));
}

export const PROGRESS_STORAGE_KEY = 'atlas-progreso';

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      conceptos: {},
      rutaActiva: null,
      setStatus: (id, status) =>
        set((state) => ({
          conceptos:
            status === null ? without(state.conceptos, id) : { ...state.conceptos, [id]: status },
        })),
      toggleStatus: (id, status) =>
        set((state) => {
          if (state.conceptos[id] !== status) {
            return { conceptos: { ...state.conceptos, [id]: status } };
          }
          // Unchecking "dominado" keeps the weaker "visto" mark, since mastering implies having seen it.
          if (status === 'dominado') return { conceptos: { ...state.conceptos, [id]: 'visto' } };
          return { conceptos: without(state.conceptos, id) };
        }),
      setActiveRoute: (rutaActiva) => set({ rutaActiva }),
      replaceAll: (data) => set({ conceptos: { ...data.conceptos }, rutaActiva: data.rutaActiva }),
      clear: () => set({ conceptos: {}, rutaActiva: null }),
    }),
    {
      name: PROGRESS_STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ conceptos: state.conceptos, rutaActiva: state.rutaActiva }),
    },
  ),
);
