import { useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Redirect, SplashScreen, useRouter } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import PageWrapper from '@/components/PageWrapper';

SplashScreen.preventAutoHideAsync();

export default function Root() {
  const router = useRouter();
  useEffect(() => {
    // router.replace('/drawer');
    SecureStore.getItemAsync('jwt')
      .then(async jwt => {
        await SplashScreen.hideAsync();
        if (jwt) {
          router.replace('/drawer');
        } else {
          router.replace('/auth');
        }
      })
      .catch(console.warn);
  }, []);
  // return <Redirect href="/drawer" />;
  return (
    <PageWrapper unsafe style={{ justifyContent: 'center' }}>
      <ActivityIndicator />
    </PageWrapper>
  );
}
