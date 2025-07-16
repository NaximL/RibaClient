import { create } from 'zustand';

interface LoadingState {
  loads: boolean;
  setLoads: (value: boolean) => void;
}

const useFetchStore = create<LoadingState>((set) => ({
  loads: false,
  setLoads: (value) => set({ loads: value }),
}));

export default useFetchStore;