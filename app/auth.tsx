import PageWrapper from '@/components/PageWrapper';
import colors from '@/utils/colors';
import { setXummJwt } from '@/utils/xummVanilla';
import { AppOwnership } from 'expo-constants';
import { Image } from 'expo-image';
import { Linking, TouchableOpacity, View } from 'react-native';
import {
  AccessTokenRequest,
  TokenResponse,
  fetchDiscoveryAsync,
  useAuthRequest,
  useAutoDiscovery,
} from 'expo-auth-session';
import { useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useLocalSearchParams, useRouter } from 'expo-router';

const redirectUri = `origami://`;
// const redirectUri = AppOwnership.Expo
//   ? `exp://u.expo.dev/5327d9b8-58af-4598-82e0-110fc1f71ad1?channel-name=preview&runtime-version=1.0.0`
//   : `origami://`;

const authorizationEndpoint = 'https://oauth2.xumm.app/auth';
const discoveryEndpoint =
  'https://oauth2.xumm.app/.well-known/openid-configuration';

export default function Auth() {
  console.log('Auth');
  // const discovery = useAutoDiscovery('https://oauth2.xumm.app/auth');
  // console.log('====================================');
  // console.log({ discovery });
  // console.log('====================================');

  const discovery = useAutoDiscovery(discoveryEndpoint);
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_XUMM_API_KEY,
      redirectUri,
      responseType: 'code',
      // codeChallenge:
    },
    discovery,
  );
  const router = useRouter();
  const params = useLocalSearchParams();
  console.log('====================================');
  console.log({ response, params });
  console.log('====================================');
  useEffect(() => {
    if (response?.type === 'success') {
      const { authorization_code, code, state } = response.params;
      const accessTokenRequest = new AccessTokenRequest({
        clientId: process.env.EXPO_PUBLIC_XUMM_API_KEY,
        code: authorization_code,
        redirectUri,
        extraParams: {
          grant_type: 'authorization_code',
          grantType: 'authorization_code',
          code_verifier: request.codeVerifier,
        },
      });
      accessTokenRequest.performAsync(discovery).then(result => {
        if (result.accessToken) {
          setXummJwt(result.accessToken);
          router.replace('/drawer');
        }
      });
    }
  }, [response?.params?.authorization_code, discovery]);

  return (
    <PageWrapper unsafe style={{ justifyContent: 'center' }}>
      <View>
        <Image
          source={require('@/assets/iconTransparent.png')}
          style={{ width: '100%', height: 200, marginBottom: 80 }}
          contentFit="contain"
        />
        <TouchableOpacity
          onPress={async () => {
            await promptAsync();
            // Linking.openURL(
            //   `https://oauth2.xumm.app/auth?client_id=${process.env.EXPO_PUBLIC_XUMM_API_KEY}&redirect_uri=${returnUri}&response_type=token`,
            // );
            // console.log('authorize', XummSdk.runtime);
            // XummSdk.authorize()
            //   .then(thing => console.log({ thing }))
            //   .catch(thing2 => console.warn({ thing2 }));
            // const payload = await XummSdk.payload?.create({
            //   custom_meta: {
            //     instruction: 'Sign request from app',
            //   },
            //   txjson: {
            //     TransactionType: 'SignIn',
            //   },
            // });
            // console.log(payload);
          }}
        >
          <Image
            source={require('@/assets/sign-in-with-xumm.png')}
            style={{
              height: 80,
              width: '100%',
              shadowColor: 'rgba(0,0,0,.25)',
              // shadowOpacity: 0.25,
              shadowRadius: 2,
              shadowOffset: { height: 2, width: 0 },
            }}
            contentFit="contain"
          />
        </TouchableOpacity>
      </View>
    </PageWrapper>
  );
}
