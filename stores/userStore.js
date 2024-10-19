import { create } from 'zustand'

const useUserStore = create((set) => ({
  location:{
    latitude:"",
    longitude:""
  },
  setLocation: (latitude, longitude) =>
    set((state) => ({
      location: {
        ...state.location, // Maintain any existing values in location
        latitude: latitude,
        longitude: longitude,
      },
    })),

    token:null,
    setToken:(t) => set((state)=>({
        token:t
    })),


}))


export default useUserStore