


import { create } from 'zustand';

type useUrokStores = {
    Urok: string; 
    SetUrok: (Urok: string) => void;
};

export const useUrokStore = create<useUrokStores>((set) => ({
    Urok: '',
    SetUrok: (Uroks) => set({ Urok: Uroks }),
}));
export default useUrokStore;
