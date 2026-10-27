// src/store/useProgressStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProgressState {
  completedMissions: number[];
  activeGlossaryTerm: string | null;
  soundEnabled: boolean;
  largeTextMode: boolean;
  
  // Actions
  completeMission: (missionId: number) => void;
  openGlossary: (termId: string) => void;
  closeGlossary: () => void;
  toggleSound: () => void;
  toggleLargeText: () => void;
  resetProgress: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      completedMissions: [],
      activeGlossaryTerm: null,
      soundEnabled: true,
      largeTextMode: false,

      completeMission: (missionId) =>
        set((state) => {
          if (state.completedMissions.includes(missionId)) {
            return state;
          }
          return { completedMissions: [...state.completedMissions, missionId] };
        }),

      openGlossary: (termId) => set({ activeGlossaryTerm: termId }),

      closeGlossary: () => set({ activeGlossaryTerm: null }),

      toggleSound: () =>
        set((state) => {
          if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
          }
          return { soundEnabled: !state.soundEnabled };
        }),

      toggleLargeText: () =>
        set((state) => ({ largeTextMode: !state.largeTextMode })),

      resetProgress: () => set({ completedMissions: [] }),
    }),
    {
      name: 'estacoes-aprendizagem-storage',
      partialize: (state) => ({
        completedMissions: state.completedMissions,
        soundEnabled: state.soundEnabled,
        largeTextMode: state.largeTextMode,
      }),
    }
  )
);