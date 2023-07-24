import { Image } from 'expo-image';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';

import PageWrapper from '@/components/PageWrapper';
import colors from '@/utils/colors';

export default function Home() {
  return (
    <PageWrapper style={styles.wrapper} unsafe>
      <Image
        source={require('@/assets/splash.png')}
        style={{ width: '100%', height: '80%' }}
        contentFit="cover"
      />
      <View style={styles.buttonRow}>
        <Link href="/drawer/issue" asChild>
          <TouchableOpacity style={styles.homeButton}>
            <Text style={styles.homeButtonText}>Issue</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/drawer/redeem" asChild>
          <TouchableOpacity style={styles.homeButton}>
            <Text style={styles.homeButtonText}>Redeem</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/drawer/verify" asChild>
          <TouchableOpacity style={styles.homeButton}>
            <Text style={styles.homeButtonText}>Verify</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </PageWrapper>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    // alignItems: 'stretch',
    // justifyContent: 'center',
    flex: 1,
    backgroundColor: 'red',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  buttonRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  homeButton: {
    padding: 20,
    backgroundColor: colors.background,
    borderRadius: 17,
    shadowOpacity: 0.25,
    shadowColor: colors.black,
    shadowRadius: 2,
    shadowOffset: { height: 2, width: 0 },
  },
  homeButtonText: {
    color: colors.headerText,
    fontSize: 17,
    fontWeight: 'bold',
  },
});
