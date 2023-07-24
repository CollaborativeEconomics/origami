import { XummPostPayloadBodyJson } from 'xumm-sdk/dist/src/types';
import * as WebBrowser from 'expo-web-browser'
import { getXummJwt } from './xummVanilla';

const url = 'https://xumm.app/api/v1/jwt/payload';


const signPayload = async (payload: XummPostPayloadBodyJson) => {
  const jwt = getXummJwt();
  const options: RequestInit = {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      Authorization: `Bearer ${jwt}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  };
  console.log({ payload, jwt })
  const response = await fetch(url, options).catch(err => console.error('error:' + err));
  console.log({ response });
  if (response) {
    const json = await response.json();
    console.log({ json });
    if (json.next.always) {
      WebBrowser.openAuthSessionAsync(json.next.always);
    }
  }
}

export { signPayload }