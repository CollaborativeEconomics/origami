import '@expo/browser-polyfill';
import { useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Redirect, SplashScreen, useFocusEffect, useRouter } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import PageWrapper from '@/components/PageWrapper';
import { isJwtValid } from '@/utils/xummVanilla';
import { storageReady } from '@/utils/storage';

// SplashScreen.preventAutoHideAsync();

export default function Root() {
  console.log('Root', navigator);
  const router = useRouter();

  const authorized = isJwtValid();
  // const checkAuthStatus = () => {
  //   console.log({ authorized });
  //   if (authorized) {
  //     router.replace('/drawer');
  //     return;
  //   }
  //   router.replace('/auth');
  // };

  // useEffect(() => {
  // setTimeout(() => {
  // checkAuthStatus();
  // }, 1);
  // XummSdk.on('ready', async () => {
  //   console.log('ready!!!');
  // });
  // XummSdk.on('retrieved', async () => {
  //   console.log('retrieved!!!');
  // });
  // return () => {
  //   XummSdk.off('ready', () => {
  //     console.log('ready off');
  //   });
  //   XummSdk.off('retrieved', () => {
  //     console.log('retrieved off');
  //   });
  // };
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
  // }, []);

  // useFocusEffect(() => {
  //   checkAuthStatus();
  // console.log('useFocusEffect');
  // router.replace('/drawer');
  // });
  if (authorized) {
    return <Redirect href="/drawer" />;
  } else {
    return <Redirect href="/auth" />;
  }
  return (
    <PageWrapper unsafe style={{ justifyContent: 'center' }}>
      <ActivityIndicator />
    </PageWrapper>
  );
}
