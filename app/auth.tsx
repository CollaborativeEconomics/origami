import PageWrapper from '@/components/PageWrapper';
import colors from '@/utils/colors';
import XummSdk from '@/utils/xumm';
import { Image } from 'expo-image';
import { Linking, TouchableOpacity, View } from 'react-native';

export default function Auth() {
  console.log('Auth');
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
            Linking.openURL(
              `https://oauth2.xumm.app/auth?client_id=${process.env.EXPO_PUBLIC_XUMM_API_KEY}&redirect_uri=cfceorigami://signin&response_type=token`,
            );
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
