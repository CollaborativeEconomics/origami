import colors from '@/utils/colors';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

interface CardProps {
  organization: string;
  amount: number;
  currency?: string;
}

export default function Card({ organization, amount, currency = 'XRP' }) {
  return (
    <View
      style={{
        backgroundColor: colors.blue,
        width: 338,
        height: 213,
        borderRadius: 17,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          width: 300,
          height: 200,
          transform: [{ rotate: '.4deg' }],
          borderRadius: 5,
          overflow: 'hidden',
          shadowOpacity: 0.25,
          shadowColor: colors.black,
          shadowOffset: { height: 1, width: 0 },
          shadowRadius: 1,
          padding: 10,
          justifyContent: 'space-between',
        }}
      >
        <LinearGradient
          style={StyleSheet.absoluteFill}
          colors={[colors.white, 'rgb(244,244,244)']}
        />
        {/* upper text area */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ width: '50%' }}>
            <Text style={{ fontWeight: 'bold' }} numberOfLines={2}>
              {organization}
            </Text>
            <Text>Expires: 12/24/24</Text>
            <View>
              <Text>Jorge Luis</Text>
              <Text style={{ fontSize: 10 }}>ID Required</Text>
            </View>
          </View>
          <View style={{ alignItems: 'flex-end', width: '50%' }}>
            <Text
              style={{ fontSize: 24, fontWeight: 'bold' }}
            >{`${amount} ${currency}`}</Text>
            <Text>CFCE</Text>
            <Text>from Evan Hudson</Text>
          </View>
        </View>
        {/* lower QR area */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View style={{ paddingTop: 5, borderWidth: 1, alignItems: 'center' }}>
            <Text>VERIFY</Text>
            <Image
              source={require('@/assets/qrexample.png')}
              style={{ height: 80, width: 80 }}
            />
          </View>
          <View style={{ paddingTop: 5, borderWidth: 1, alignItems: 'center' }}>
            <Text>REDEEM</Text>
            <Image
              source={require('@/assets/qrexample.png')}
              style={{ height: 80, width: 80 }}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
