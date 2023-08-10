import { storagePersist } from '@/utils/storage'
import { produce } from 'immer';
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export interface Transaction {
  amount: string;
  sender: string;
  recipient: string;
  expirationDate: number;
  condition?: string;
  txid?: string;
  fulfillment?: string;
  senderName?: string;
  authorizedPerson?: string;
  recipientName?: string;
  message?: string;
  qrData?: string;
  qrDataWithoutFulfillment?: string;
}
interface OrigamiState {
  jwt: string;
  currentTransaction: Transaction;
  setCurrent: (key: keyof Transaction, value: Transaction[keyof Transaction]) => void;
  transactions: {
    [txid: string]: Transaction
  };
  addTransaction: (transaction: Transaction) => void;
}

const useOrigamiStore = create<OrigamiState>()(
  immer(persist((set) => ({
    jwt: '',
    currentTransaction: {
      expirationDate: Date.now() + 1000 * 60 * 60 * 24,
      sender: '',
      recipient: '',
      amount: '0',
    },
    setCurrent: (key: keyof Transaction, value: Transaction[keyof Transaction]) => set(produce((state) => {
      state.currentTransaction[key] = value
    })),
    transactions: {},
    addTransaction: (transaction: Transaction) => set((state) => (
      {
        transactions: {
          ...state.transactions, [transaction.txid]: transaction
        }
      }
    )),
  }), {
    name: 'origami-store',
    storage: createJSONStorage(() => storagePersist),
  })))

export default useOrigamiStore