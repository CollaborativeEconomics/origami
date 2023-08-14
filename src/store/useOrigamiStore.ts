import storage, { storagePersist } from '@/utils/storage'
import { current, produce } from 'immer';
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export interface Transaction {
  recipient: string;
  expirationDate: number;
  sender?: string;
  amount?: string;
  condition?: string;
  txid?: string;
  fulfillment?: string;
  senderName?: string;
  authorizedPerson?: string;
  recipientName?: string;
  message?: string;
  qrData?: string;
  qrDataWithoutFulfillment?: string;
  rawTransaction?: any
}
interface OrigamiState {
  jwt: string;
  currentTransaction: Transaction;
  setCurrent: (key: keyof Transaction, value: Transaction[keyof Transaction]) => void;
  transactions: {
    [txid: string]: Transaction
  };
  addTransaction: (transaction: Transaction) => void;
  clearCurrentTransaction: () => void,
}

const useOrigamiStore = create<OrigamiState>()(
  immer(persist((set) => ({
    jwt: '',
    currentTransaction: {
      expirationDate: Date.now() + 1000 * 60 * 60 * 24,
      recipient: '',
    },
    clearCurrentTransaction: () => set((state) => ({
      currentTransaction: {
        sender: state.currentTransaction.sender, // logged in user is always the sender
        expirationDate: Date.now() + 1000 * 60 * 60 * 24,
        recipient: '',
      }
    })),
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