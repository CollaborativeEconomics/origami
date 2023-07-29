import storage from '@/utils/storage';
import { useRouter } from 'expo-router';

export default function Logout() {
  const router = useRouter();
  storage.clearAll();
  router.replace('/');
  return null;
}
