import { useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Redirect, SplashScreen, useFocusEffect, useRouter } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import PageWrapper from '@/components/PageWrapper';
import XummSdk from '@/utils/xumm';

// SplashScreen.preventAutoHideAsync();

export default function Root() {
  const router = useRouter();

  const checkAuthStatus = async () => {
    // console.log(JSON.stringify(XummSdk));
    // if (false) {
    //   router.replace('/drawer');
    // } else {
    // }
    const pong = await XummSdk.ping().catch(console.warn);
    const jwt = XummSdk.environment.jwt;
    console.log({ pong, jwt });
    const userAccount = await XummSdk.user.account;
    console.log({ userAccount });
    router.replace('/auth');
  };

  useEffect(() => {
    checkAuthStatus();
    XummSdk.on('ready', async () => {
      console.log('ready!!!');
    });
    XummSdk.on('retrieved', async () => {
      console.log('retrieved!!!');
    });
    return () => {
      XummSdk.off('ready', () => {
        console.log('ready off');
      });
      XummSdk.off('retrieved', () => {
        console.log('retrieved off');
      });
    };
    // await SplashScreen.hideAsync();
    // if (XummSdk.) {
    //   console.log(XummSdk.user);
    //   router.replace('/drawer');
    // } else {
    //   router.replace('/auth');
    // }
    // router.replace('/drawer');
    //   SecureStore.getItemAsync('jwt')
    //     .then(async jwt => {
    //       console.log('====================================');
    //       console.log({ jwt });
    //       console.log('====================================');
    //       if (jwt) {
    //         XummSdk.
    //         router.replace('/drawer');
    //       } else {
    //         router.replace('/auth');
    //       }
    //     })
    //     .catch(console.warn);
  }, []);

  useFocusEffect(() => {
    checkAuthStatus();
    // console.log('useFocusEffect');
    // router.replace('/drawer');
  });
  // return <Redirect href="/drawer" />;
  return (
    <PageWrapper unsafe style={{ justifyContent: 'center' }}>
      <ActivityIndicator />
    </PageWrapper>
  );
}
