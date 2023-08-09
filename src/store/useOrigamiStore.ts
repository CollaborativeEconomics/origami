import { storagePersist } from '@/utils/storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface OrigamiState {
  jwt: string;
  transactions: {
    [txId: string]: {
      id: string;
      condition: string;
      fulfillment: string;
    };
  };
}

const useOrigamiStore = create(
  persist((set) => ({
    jwt: '',
    transactions: {}
  }), {
    name: 'origami-store',
    storage: createJSONStorage(() => storagePersist),

  }))