import { create } from 'zustand';

type Error = {
    name: string;
    label: string;
    status: boolean
};

type ErrorStore = {
    errors: Error;
    setError: (errors: Error) => void;
};


export const UseErrorStore = create<ErrorStore>((set) => ({
    errors: {
        name: "",
        label: "",
        status: false
    },
    setError: (errors) => set({ errors }),
}));

export default UseErrorStore;