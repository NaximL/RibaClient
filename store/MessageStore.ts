import { create } from 'zustand';

type Messagestore = {
    Message: any[]; 
    SetMessage: (Mfw: any[]) => void;
};

export const useMessageStore = create<Messagestore>((set) => ({
    Message: [],
    SetMessage: (Mfw) => set({ Message: Mfw }),
}));
export default useMessageStore;
