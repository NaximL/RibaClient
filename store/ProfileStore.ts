import { create } from 'zustand';

type Profile = {
  entext: Array<any>;
  teach: Array<any>;
};

type ProfileStore = {
  Prof: Profile;
  setProfile: (profile: Profile) => void;
};


export const useProfileStore = create<ProfileStore>((set) => ({
  Prof: {
    entext: [],
    teach: [],
  },
  setProfile: (Prof) => set({ Prof }),
}));
export default useProfileStore;