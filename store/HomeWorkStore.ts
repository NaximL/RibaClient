import { create } from 'zustand';

type HomeWorkStore = {
    HomeWork: any[]; 
    SetHomeWork: (Home: any[]) => void;
};

export const useHomeWorkStore = create<HomeWorkStore>((set) => ({
    HomeWork: [],
    SetHomeWork: (Hosme) => set({ HomeWork: Hosme }),
}));
export default useHomeWorkStore;
