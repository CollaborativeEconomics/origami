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
  // const router = useRouter();
  useEffect(() => {
    if (params.txid && params.fulfillment) {
      setRedeemEnabled(true);
      return;
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
        // Account: sender,
        // Amount: xrpToDrops(formData.amount),
        // CancelAfter: unixTimeToRippleTime(expirationDate),
        // FinishAfter: unixTimeToRippleTime(Date.now() + 1000 * 60),
        // Destination: formData.recipient,
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

  return (
    <PageWrapper>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        {/* <TouchableOpacity onPress={} style={[styles.submitButton]}>
          <MaterialIcons name="camera-alt" />
        </TouchableOpacity> */}
        <TouchableOpacity
          disabled={!redeemEnabled}
          onPress={redeem}
          style={[
            styles.submitButton,
            redeemEnabled ? {} : styles.disabledButton,
          ]}
        >
          <Text
            style={{
              color: redeemEnabled ? colors.headerText : colors.disabledText,
              textAlign: 'center',
            }}
          >
            Redeem
          </Text>
        </TouchableOpacity>
      </View>
    </PageWrapper>
  );
}

const styles = StyleSheet.create({
  submitButton: {
    flex: 1,
    backgroundColor: colors.background,
    paddingVertical: 20,
    borderRadius: 40,
    shadowColor: 'rgba(0,0,0,.25)',
    shadowRadius: 2,
    shadowOffset: { height: 2, width: 0 },
  },
  disabledButton: {
    backgroundColor: colors.disabled,
  },
});
