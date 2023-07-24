import PageWrapper from '@/components/PageWrapper';
import colors from '@/utils/colors';
import Xumm, { setXummJwt } from '@/utils/xumm';
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
import { useRouter } from 'expo-router';

const redirectUri = `origami://`;

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
    },
    discovery,
  );
  // const router = useRouter();
  useEffect(() => {
    if (response?.type === 'success') {
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
        <TouchableOpacity onPress={async () => {}}>
          <Image
            source={require('@/assets/sign-in-with-xumm.png')}
            style={{
              height: 80,
              width: '100%',
              shadowColor: colors.black,
              shadowOpacity: 0.25,
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
