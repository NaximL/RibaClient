import { create } from 'zustand';

type DiaryStore = {
    Diary: any[]; 
    SetDiary: (Diary: any[]) => void;
};

export const useDiaryStore = create<DiaryStore>((set) => ({
    Diary: [],
    SetDiary: (Diary) => set({ Diary: Diary }),
}));
export default useDiaryStore;
