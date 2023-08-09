import { XummPostPayloadBodyJson } from 'xumm-sdk/dist/src/types';
import { getXummJwt, parseJwt } from './xummVanilla';
import { Linking } from 'react-native';

const baseUrl = 'https://xumm.app/api/v1';

const getHeaders = () => ({
  authorization: `Bearer ${getXummJwt()}`,
  accept: 'application/json',
  'content-type': 'application/json'
})


const signPayload = async (payload: XummPostPayloadBodyJson) => {
  const options: RequestInit = {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: getHeaders()
  };
  console.log({ payload })
  const response = await fetch(`${baseUrl}/jwt/payload`, options).catch(err => console.error('error:' + err));
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
  const pingUrl = `${baseUrl}/jwt/ping`;
  const response = await fetch(pingUrl, {
    method: 'GET',
    headers: getHeaders()
  }).catch(err => console.error('error:' + err));
  console.log({ response: JSON.stringify(response) });
  if (response) {
    const json = await response.json();
    console.log({ json: JSON.stringify(json) }); // {"json": "{"error":{"reference":"55e315f7-ae5f-4a92-a5b2-db5dbbc6c13b","code":812}}"}
  }
}

// const getTransaction = async (txid: string) => {
//   const response = await fetch(`${baseUrl}/jwt/xrpl-tx/${txid}`, {
//     method: 'GET',
//     headers: getHeaders(),
//   }).catch(err => console.error('error:' + err));
//   console.log({ response: JSON.stringify(response), url: `${baseUrl}/jwt/xrpl-tx/${txid}` });
//   if (response) {
//     const json = await response.json();
//     console.log({ json });
//   }
// }
const getTransaction = async (txid: string) => {
  const jwt = getXummJwt();
  const { network_endpoint, network_type } = parseJwt(jwt);
  console.log({ jwt: parseJwt(jwt) });
  const url = network_type === 'TESTNET'
    ? 'https://s.altnet.rippletest.net:51234/'
    : 'https://s1.ripple.com:51234/';
  // const url = network_endpoint.replace('wss://', 'https://');
  const txData = {
    "method": "tx",
    "params": [
      {
        "transaction": txid,
        "binary": false
      }
    ]
  }
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(txData),
  }).catch(err => console.error('error:' + err));
  if (!response) return;
  const json = await response.json();
  // const json = await response.text();
  return json;
}

export { signPayload, ping, getTransaction }