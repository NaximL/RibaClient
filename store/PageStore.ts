
import { create } from 'zustand';

interface PageState {
    Page: number;
    SetPage: (value: number) => void;
}

const usePageStore = create<PageState>((set) => ({
    Page: 0,
    SetPage: (value) => set({ Page: value }),
}));

export default usePageStore;


