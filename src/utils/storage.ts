import { MMKV } from 'react-native-mmkv'
import crypto from 'crypto';
import * as SecureStore from 'expo-secure-store';

let storage = new MMKV();
// {} as MMKV;

// Use a consistent encryption key
// SecureStore.getItemAsync('encryption_key').then((key) => {
//   let finalKey = key;
//   if (!finalKey) {
//     const bytes = crypto.randomBytes(32) as Buffer;
//     const finalKey = bytes.toString('hex');
//     SecureStore.setItemAsync('encryption_key', finalKey);
//   }
//   storage = new MMKV({ id: 'origami', encryptionKey: finalKey });
// })

const storageReady = () => new Promise(resolve => {
  const checkStatus = () => {
    setTimeout(() => {
      if (typeof storage.getString !== 'undefined') {
        resolve(true);
        return true;
      }
      return checkStatus();
    }, 100);
  }
  return checkStatus();
});

export { storageReady }

export default storage;
