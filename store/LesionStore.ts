import { create } from 'zustand';

interface Lesson {
    urok: string;
    time: string;
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