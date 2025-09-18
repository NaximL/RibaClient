import { create } from 'zustand';

type DateStore = {
  Dates: Date;
  setDate: (date: Date) => void;
};

export const useDateStore = create<DateStore>((set) => ({
  Dates: new Date(),
  setDate: (date) => set({ Dates: date }),
}));

export default useDateStore;