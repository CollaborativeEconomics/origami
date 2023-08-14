import { Buffer } from 'buffer';
import storage from "./storage"
import useOrigamiStore from '@/store/useOrigamiStore';
import { useMMKVString } from 'react-native-mmkv';
import { produce } from 'immer';

export const parseJwt = (token: string) => {
  try {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString("utf8"));
  } catch (e) {
    console.log('error parsing jwt', e)
    return null;
  }
}

const setXummJwt = (jwt: string) => {
  const { sub } = parseJwt(jwt);
  storage.set('jwt', jwt);
  useOrigamiStore.setState(produce((state) => { state.currentTransaction.sender = sub }))
}

const getXummJwt = () =>
  storage.getString('jwt');

const isJwtValid = (providedJwt?: string) => {
  const { setCurrent } = useOrigamiStore()
  const jwt = providedJwt ?? storage.getString('jwt');
  // expired?
  if (jwt) {
    const parsed = parseJwt(jwt);
    setCurrent('sender', parsed.sub)
    if (parsed?.exp * 1000 > Date.now()) {
      return true;
    }
  }
  return false;
}

const useJwtIsValid = () => {
  const [jwt] = useMMKVString('jwt');
  return isJwtValid(jwt);
}

export { setXummJwt, getXummJwt, isJwtValid, useJwtIsValid };