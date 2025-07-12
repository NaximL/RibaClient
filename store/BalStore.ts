import { create } from 'zustand';

type BalStore = {
  bal: number | null;
  setBal: (bal: number | null) => void;
};

export const useBalStore = create<BalStore>((set) => ({
  bal: null,
  setBal: (bal) => set({ bal }),
}));
export default useBalStore;