import { XummSdk } from 'xumm-sdk';
import * as SecureStore from 'expo-secure-store';

let Xumm = new XummSdk(process.env.EXPO_PUBLIC_XUMM_API_KEY);
// let Xumm = new XummPkce(process.env.EXPO_PUBLIC_XUMM_API_KEY, {
//   redirectUrl: 'origami://',
//   storage: {
//     getItem: storage.getString,
//     setItem: storage.set,
//     removeItem: storage.delete,
//     clear: storage.clearAll,
//     key: (n: number) => storage.getAllKeys()[n],
//     length: storage.getAllKeys().length, // this will be right some of the times
//   },
//   implicit: true,
// });

// console.log({ xapp: XummSdk.runtime.xapp });

const setXummJwt = (jwt: string) => {
  // XummSdk = new Xumm(process.env.EXPO_PUBLIC_XUMM_API_KEY);
  const NewSdk = new XummSdk(jwt);
  SecureStore.setItemAsync('jwt', jwt);
  console.log('====================================');
  // console.log('setXummJwt', NewSdk.environment.jwt);
  NewSdk.ping().then((res) => { console.log({ pong: res }) }).catch(console.warn)
  console.log('====================================');
  Xumm = NewSdk;
  // Xumm = new XummPkce
};

// const XummPkce = new PKCE({
//   client_id: process.env.EXPO_PUBLIC_XUMM_API_KEY,
//   redirect_uri: 'origami://',
//   authorization_endpoint: 'https://oauth2.xumm.app/auth',
//   token_endpoint: 'https://oauth2.xumm.app/token',
//   requested_scopes: '*',
// });
export { setXummJwt };
export default XummSdk;
