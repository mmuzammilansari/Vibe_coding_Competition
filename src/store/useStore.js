import { create } from 'zustand';

export const useStore = create((set) => ({
  variant: 's',
  paint: 'graphite',
  compareVariant: 's',
  compareMode: false,
  soundOn: false,
  effectsOff: false,
  loaderDone: false,
  environment: 'studio',
  setVariant: (variant) => set({ variant }),
  setPaint: (paint) => set({ paint }),
  setCompareVariant: (compareVariant) => set({ compareVariant }),
  setCompareMode: (compareMode) => set({ compareMode }),
  setSoundOn: (soundOn) => set({ soundOn }),
  setEffectsOff: (effectsOff) => set({ effectsOff }),
  setLoaderDone: () => set({ loaderDone: true }),
  setEnvironment: (environment) => set({ environment }),
}));
