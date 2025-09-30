import { create } from 'zustand';

interface Lesson {
    num:number;
    urok: string;
    time: string;
    teach:string;
}

type ScheduleDay = Lesson[];
type LesionStore = {
    lesion: ScheduleDay[];
    setLesions: (lesion: ScheduleDay[]) => void;
};

export const useLesionStore = create<LesionStore>((set) => ({
    lesion: [],
    setLesions: (lesion) => set({ lesion }),
}));

export default useLesionStore;