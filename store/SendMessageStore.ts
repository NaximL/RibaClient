


import { create } from 'zustand';

type useMessageSendStore = {
    MessageSend: any[]; 
    setMessageSend: (Mfw: any[]) => void;
};

export const useMessageSendStore = create<useMessageSendStore>((set) => ({
    MessageSend: [],
    setMessageSend: (Mfw) => set({ MessageSend: Mfw }),
}));
export default useMessageSendStore;
