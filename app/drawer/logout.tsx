import storage from '@/utils/storage';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';

export default function Logout() {
  const logout = useCallback(() => {
    const router = useRouter();
    storage.clearAll();
    router.replace('/');
  }, []);
  return null;
}
