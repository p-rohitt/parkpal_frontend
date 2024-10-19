import { create } from 'zustand'

const useLotStore = create((set) => ({
  lots:[],
  setParkingLots: (parkinglots) => set((state)=> ({
    lots:parkinglots
  }))

}))


export default useLotStore