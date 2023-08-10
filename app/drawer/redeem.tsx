import Button from '@/components/Button';
import PageWrapper from '@/components/PageWrapper';
import colors from '@/utils/colors';
import { getTransaction, signPayload } from '@/utils/xummApi';
import { parseJwt } from '@/utils/xummVanilla';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useMMKVString } from 'react-native-mmkv';
import { XummPostPayloadBodyJson } from 'xumm-sdk/dist/src/types';

interface RedeemParams extends Record<string, string | string[]> {
  txid: string;
  fulfillment: string;
  owner: string;
  condition: string;
}

export default function Redeem() {
  const params = useLocalSearchParams<RedeemParams>();
  const [redeemEnabled, setRedeemEnabled] = useState<boolean>(false);
  const [jwt] = useMMKVString('jwt');
  const { sub: sender } = parseJwt(jwt);
  console.log({ params });
  const router = useRouter();
  useEffect(() => {
    if (params.txid && params.fulfillment) {
      setRedeemEnabled(true);
      return;
    }
    if (params.qrData) {
      console.log({ qrData: params.qrData });
    }
    setRedeemEnabled(false);
    // router.replace(`/scanQrCode?routeOrigin=/drawer/redeem&dataKey=qrData`);
  }, [params.txid, params.fulfillment]);

  const redeem = useCallback(async () => {
    const transaction = await getTransaction(params.txid);
    console.log({
      sequence: transaction.result.Sequence,
      condition: params.condition,
    });
    // return;
    const payload: XummPostPayloadBodyJson = {
      txjson: {
        Condition: params.condition,
        OfferSequence: transaction.result.Sequence,
        Owner: params.owner ?? sender,
        TransactionType: 'EscrowFinish',
        Fulfillment: params.fulfillment,
      },
      options: {
        return_url: {
          app: 'origami://drawer/redeem?success=true',
          web: 'origami://drawer/redeem?success=true',
        },
      },
    };
    signPayload(payload);
  }, [params.fulfillment, params.txid, params.owner, params.condition]);

  const redeemWithChange = useCallback(async () => {
    redeem();
  }, []);

  return (
    <PageWrapper>
      <View style={styles.container}>
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity
            style={{
              borderRadius: 10,
              height: 150,
              width: 150,
              borderColor: colors.border,
              borderWidth: 1,
              borderStyle: 'dashed',
              padding: 20,
              alignSelf: 'center',
              marginTop: 80,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 5,
            }}
            onPress={() =>
              router.replace(`/scanQrCode?routeOrigin=/drawer/redeem`)
            }
          >
            <>
              <MaterialIcons
                name="qr-code-scanner"
                size={80}
                color={colors.disabledText}
              />
            </>
          </TouchableOpacity>
          <Text style={{ color: colors.disabledText }}>Scan QR Code</Text>
        </View>
        <View>
          <Text style={styles.textRow}>Issued by: {params.owner}</Text>
          <Text style={styles.textRow}>Transaction ID: {params.txid}</Text>
          <Text style={styles.textRow}>Condition: {params.condition}</Text>
          <Text
            style={[
              styles.textRow,
              { color: params.fulfillment ? colors.success : colors.error },
            ]}
          >
            {params.fulfillment ? 'Fulfillable' : 'Not Fulfillable'}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            text="Redeem"
            onPress={redeem}
            disabled={!redeemEnabled}
            primary
          />
          <Button
            text="Redeem with Change"
            onPress={redeemWithChange}
            disabled={!redeemEnabled}
          />
        </View>
      </View>
    </PageWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between' },
  textRow: {
    marginBottom: 20,
  },
  buttonContainer: { flexDirection: 'row', gap: 20 },
});
