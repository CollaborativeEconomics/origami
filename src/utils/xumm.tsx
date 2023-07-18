import { Xumm } from 'xumm';

const XummSdk = new Xumm(
  process.env.EXPO_PUBLIC_XUMM_API_KEY,
  process.env.EXPO_PRIVATE_XUMM_API_SECRET,
);
XummSdk.runtime.xapp = true;

export default XummSdk;
