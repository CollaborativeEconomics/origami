import { storagePersist } from '@/utils/storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface Transaction {
  txId: string;
  condition: string;
  fulfillment: string;
}
interface OrigamiState {
  jwt: string;
  transactions: {
    [txId: string]: Transaction
  };
  addTransaction: (transaction: Transaction) => void;
}

const useOrigamiStore = create<OrigamiState>()(
  persist((set) => ({
    jwt: '',
    transactions: {},
    addTransaction: ({ txId, condition, fulfillment }: Transaction) => set((state) => (
      {
        transactions: {
          ...state.transactions, [txId]: {
            txId,
            condition,
            fulfillment
          }
        }
      }
    )),
  }), {
    name: 'origami-store',
    storage: createJSONStorage(() => storagePersist),
  }))

export default useOrigamiStore