import '@expo/browser-polyfill';
import { ActivityIndicator } from 'react-native';
import PageWrapper from '@/components/PageWrapper';
import { useRootNavigationState, useRouter } from 'expo-router';
import { useJwtIsValid } from '@/utils/xummVanilla';
import { useEffect } from 'react';

// SplashScreen.preventAutoHideAsync();
const useUnauthorizedRedirect = () => {
  const router = useRouter();
  const authorized = useJwtIsValid();
  const rootNavigationState = useRootNavigationState();
  useEffect(() => {
    console.log({ authorized, key: rootNavigationState?.key });
    if (rootNavigationState?.key) {
      console.log({ authorized, key: rootNavigationState?.key });
      if (authorized) {
        router.replace('/drawer');
      } else {
        router.replace('/auth');
      }
    }
  }, [authorized, rootNavigationState?.key]);
};

export default function Root() {
  useUnauthorizedRedirect();
  return (
    <PageWrapper unsafe style={{ justifyContent: 'center' }}>
      <ActivityIndicator />
    </PageWrapper>
  );
}
