
import { create } from 'zustand';

interface LoadingState {
  load: boolean;
  setLoad: (value: boolean) => void;
}

const useLoadingStore = create<LoadingState>((set) => ({
  load: true,
  setLoad: (value) => set({ load: value }),
}));

export default useLoadingStore;