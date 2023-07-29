import { XummPostPayloadBodyJson } from 'xumm-sdk/dist/src/types';
import * as WebBrowser from 'expo-web-browser'
import { getXummJwt } from './xummVanilla';
import { Linking } from 'react-native';

const url = 'https://xumm.app/api/v1/jwt/payload';
const pingUrl = 'https://xumm.app/api/v1/jwt/ping';


const signPayload = async (payload: XummPostPayloadBodyJson) => {
  const jwt = getXummJwt();
  const options: RequestInit = {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      authorization: `Bearer ${jwt}`,
      accept: 'application/json',
      'content-type': 'application/json'
    }
  };
  console.log({ payload, jwt })
  const response = await fetch(url, options).catch(err => console.error('error:' + err));
  console.log({ response: JSON.stringify(response) });
  if (response) {
    const json = await response.json();
    console.log({ json: JSON.stringify(json) });
    if (json.next.always) {
      // return WebBrowser.openAuthSessionAsync(json.next.always);
      Linking.openURL(json.next.always);
    }
  }
}

const ping = async () => {
  const pingUrl = 'https://xumm.app/api/v1/jwt/ping';
  const jwt = getXummJwt(); // gets from local storage
  console.log('ping', jwt); // this is what I copied and pasted, and worked
  const response = await fetch(pingUrl, {
    method: 'GET',
    headers: { Authorization: `Bearer ${jwt}` }
  }).catch(err => console.error('error:' + err));
  console.log({ response: JSON.stringify(response) });
  if (response) {
    const json = await response.json();
    console.log({ json: JSON.stringify(json) }); // {"json": "{"error":{"reference":"55e315f7-ae5f-4a92-a5b2-db5dbbc6c13b","code":812}}"}
  }
}

export { signPayload, ping }