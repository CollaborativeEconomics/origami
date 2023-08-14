import PageWrapper from '@/components/PageWrapper';
import { setXummJwt } from '@/utils/xummVanilla';
import { Image } from 'expo-image';
import { ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import {
  AccessTokenRequest,
  useAuthRequest,
  useAutoDiscovery,
} from 'expo-auth-session';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';

const redirectUri = `origami://`;
// const redirectUri = AppOwnership.Expo
//   ? `exp://u.expo.dev/5327d9b8-58af-4598-82e0-110fc1f71ad1?channel-name=preview&runtime-version=1.0.0`
//   : `origami://`;

const authorizationEndpoint = 'https://oauth2.xumm.app/auth';
const discoveryEndpoint =
  'https://oauth2.xumm.app/.well-known/openid-configuration';

export default function Auth() {
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
        console.log('auth result', result);

        if (result.accessToken) {
          setXummJwt(result.accessToken);
          router.replace('/drawer');
        }
      });
    }
  }, [response?.params?.authorization_code, discovery]);

  return (
    <PageWrapper unsafe style={styles.wrapper}>
      <Image
        source={require('@/assets/splash.png')}
        style={StyleSheet.absoluteFill}
      />
      <TouchableOpacity
        onPress={async () => {
          await promptAsync();
        }}
      >
        <Image
          source={require('@/assets/sign-in-with-xumm.png')}
          style={styles.signInButton}
          contentFit="contain"
        />
      </TouchableOpacity>
    </PageWrapper>
  );
}

const styles = {
  wrapper: {
    justifyContent: 'flex-end',
  },
  signInButton: {
    height: 80,
    width: '80%',
    alignSelf: 'center',
    marginBottom: 40,
    shadowColor: 'rgba(0,0,0,.25)',
    // shadowOpacity: 0.25,
    shadowRadius: 2,
    shadowOffset: { height: 2, width: 0 },
  },
};
