import { MMKV } from 'react-native-mmkv'
import crypto from 'crypto';
import * as SecureStore from 'expo-secure-store';

let storage = {} as MMKV;

// Use a consistent encryption key
SecureStore.getItemAsync('encryption_key').then((key) => {
  let finalKey = key;
  if (!key) {
    const bytes = crypto.randomBytes(32) as Buffer;
    const finalKey = bytes.toString('hex');
    SecureStore.setItemAsync('encryption_key', finalKey);
  }
  storage = new MMKV({ id: 'origami', encryptionKey: finalKey });
})

export default storage;
