import Button from '@/components/Button';
import PageWrapper from '@/components/PageWrapper';
import useOrigamiStore from '@/store/useOrigamiStore';
import colors from '@/utils/colors';
import { getTransaction, signPayload } from '@/utils/xummApi';
import { parseJwt } from '@/utils/xummVanilla';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { XummPostPayloadBodyJson } from 'xumm-sdk/dist/src/types';

interface RedeemParams extends Record<string, string | string[]> {
  txid: string;
  fulfillment: string;
  owner: string;
  condition: string;
}

export default function Redeem() {
  const params = useLocalSearchParams<RedeemParams>();
  const router = useRouter();
  const {
    clearCurrentTransaction,
    setCurrent,
    currentTransaction: {
      sender,
      txid,
      condition,
      fulfillment,
      message,
      authorizedPerson,
    },
  } = useOrigamiStore();
  useEffect(() => {
    if (params.txid) {
      console.log('has txid');
      clearCurrentTransaction();
      setCurrent('txid', params.txid);
      setCurrent('authorizedPerson', params.authorizedPerson);
      setCurrent('message', params.message);
      setCurrent('condition', params.condition);
      if (params.fulfillment) {
        console.log('has fulfillment');
        setCurrent('fulfillment', params.fulfillment);
        return;
      }
    }
    // router.replace(`/scanQrCode?routeOrigin=/drawer/redeem&dataKey=qrData`);
  }, [params.txid, params.fulfillment]);

  useEffect(() => {
    if (params.txid) {
      console.log('fetching transaction', params.txid);
      getTransaction(params.txid).then(transaction => {
        console.log({ transaction });
      });
    }
  }, [params.txid]);

  return (
    <PageWrapper>
      <View style={styles.container}>
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity
            style={styles.QRButton}
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
        <View style={styles.textRowContainer}>
          <Text style={styles.textRow}>Issued by: {sender}</Text>
          <Text style={styles.textRow}>Transaction ID: {txid}</Text>
          <Text style={styles.textRow}>Condition: {condition}</Text>
          <Text style={styles.textRow}>Message: {message}</Text>
          <Text style={styles.textRow}>
            Authorized Person: {authorizedPerson}
          </Text>
          <Text
            style={[
              styles.textRow,
              { color: params.fulfillment ? colors.success : colors.error },
            ]}
          >
            {params.fulfillment ? 'Fulfillable' : 'Not Fulfillable'}
          </Text>
        </View>
      </View>
    </PageWrapper>
  );
}

const styles = StyleSheet.create({
  QRButton: {
    borderRadius: 10,
    height: 120,
    width: 120,
    borderColor: colors.border,
    borderWidth: 1,
    borderStyle: 'dashed',
    padding: 20,
    alignSelf: 'center',
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  container: { flex: 1, justifyContent: 'space-between' },
  textRow: {
    padding: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  textRowContainer: {
    borderColor: colors.border,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    marginVertical: 20,
  },
  buttonContainer: { flexDirection: 'row', gap: 20 },
});
