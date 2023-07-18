// TODO: decide whether to keep state management
// import { create } from 'zustand'
// import { createJSONStorage, persist } from 'zustand/middleware'

// const useOrigamiStore = create(
//   persist((set) => ({
//     jwt: '',
//     setJwt: (jwt: string) => set({ jwt }),
//     clearJwt: () => set({ jwt: '' }),
//   }), {
//     name: 'origami-store',
//     storage: createJSONStorage(() => AsyncStorage),

//   }))