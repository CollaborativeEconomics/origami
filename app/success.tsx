import PageWrapper from '@/components/PageWrapper';
import colors from '@/utils/colors';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { StyleSheet, Text, View } from 'react-native';

export default function Success() {
  const router = useRouter();
  setTimeout(() => {
    router.push('/drawer');
  }, 2 * 1000);
  return (
    <PageWrapper style={styles.wrapper}>
      <View style={styles.content}>
        <LottieView
          autoPlay
          style={{
            width: 200,
            height: 200,
          }}
          source={require('../assets/success_lottie.json')}
          // source={require('../assets/animation_ll6qtrnf.json')}
          loop={false}
        />
        <Text style={styles.successText}>Success!</Text>
      </View>
    </PageWrapper>
  );
}

const styles = StyleSheet.create({
  successText: {
    fontSize: 44,
    textAlign: 'center',
    color: colors.success,
    textTransform: 'uppercase',
  },
  wrapper: { justifyContent: 'center', alignItems: 'center' },
  content: { marginTop: '50%' },
});
