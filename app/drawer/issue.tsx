import PageWrapper from '@/components/PageWrapper';
import TextInput from '@/components/TextInput';
import colors from '@/utils/colors';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Print from 'expo-print';
import { useCallback, useEffect, useRef, useState } from 'react';
import * as Clipboard from 'expo-clipboard';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Receipt from '@/components/Receipt';
import getReceiptForPrint from '@/utils/getReceiptForPrint';
import useOrigamiStore from '@/store/useOrigamiStore';
import Button from '@/components/Button';
import issueEscrow from '@/utils/issueEscrow';
import QRGenerator from '@/components/QRGenerator';

export default function Issue() {
  const QRGeneratorRef = useRef(null);
  const {
    setCurrent,
    clearCurrentTransaction,
    currentTransaction: {
      txid,
      condition,
      expirationDate,
      fulfillment,
      sender,
      senderName,
      recipient,
      recipientName,
      authorizedPerson,
      message,
      amount,
    },
  } = useOrigamiStore();
  console.log({
    txid,
    condition,
    fulfillment,
    sender,
    recipient,
    amount,
  });
  const { txid: txidParam, qrData: recipientParam } = useLocalSearchParams<{
    qrData: string;
    txid: string;
  }>();
  const [printEnabled, setPrintEnabled] = useState<boolean>(false);

  const router = useRouter();

  // initialize
  useEffect(() => {}, []);

  // handle params
  useEffect(() => {
    setCurrent('recipientName', '');
    setCurrent('senderName', '');
    if (recipientParam) {
      setCurrent('recipient', recipientParam);
      router.setParams({ recipient: null });
    }
    if (txidParam) {
      setCurrent('txid', txidParam);
      router.setParams({ txid: null, cid: null, id: null, txblob: null });
    }
    if (txid) {
      setPrintEnabled(true);
    } else {
      setPrintEnabled(false);
    }
  }, [txidParam, recipientParam]);

  // useSaveNameByOrgID(recipient, 'recipientName');
  // useSaveNameByOrgID(sender, 'senderName');
  console.log({ senderName, recipientName, sender, txid });

  const handlePrint = useCallback(async () => {
    const { qrData, qrDataWithoutFulfillment } =
      await QRGeneratorRef?.current?.generateQR();

    const html = getReceiptForPrint({
      recipient,
      recipientName,
      sender,
      senderName,
      authorizedPerson,
      amount,
      expirationDate,
      message,
      qrData,
      qrDataWithoutFulfillment,
      txid,
    });
    try {
      const success = await Print.printAsync({ html });
      console.log('print', { success });
    } catch (error) {
      console.log('print error', { error });
      return;
    }
    clearCurrentTransaction();
    router.replace('/drawer');
  }, [
    recipient,
    recipientName,
    sender,
    senderName,
    authorizedPerson,
    amount,
    expirationDate,
    message,
    txid,
    QRGeneratorRef?.current?.generateQR,
  ]);

  return (
    <PageWrapper style={{ paddingHorizontal: 0 }}>
      <QRGenerator ref={QRGeneratorRef} />
      <View style={styles.formContainer}>
        <TouchableOpacity
          onPress={clearCurrentTransaction}
          style={{ marginBottom: 20 }}
        >
          <Text style={{ textDecorationLine: 'underline', textAlign: 'right' }}>
            Clear
          </Text>
        </TouchableOpacity>
        <TextInput
          label="Recipient"
          value={recipient}
          onChangeText={value => setCurrent('recipient', value)}
          icons={[
            {
              icon: 'camera-alt',
              onIconPress: async () => {
                // const text = await Camera.;
                // onChange(text);
                router.replace(`/scanQrCode?routeOrigin=/drawer/issue`);
              },
            },
            {
              icon: 'content-copy',
              onIconPress: async () => {
                const text = await Clipboard.getStringAsync();
                setCurrent('recipient', text);
              },
            },
          ]}
        />
        <TextInput
          label="Authorized Name/ID#"
          value={authorizedPerson}
          onChangeText={value => setCurrent('authorizedPerson', value)}
        />
        <TextInput
          label="Message"
          value={message}
          onChangeText={value => setCurrent('message', value)}
        />
        <TextInput
          label="Amount"
          value={amount}
          onChangeText={value => setCurrent('amount', value)}
          keyboardType="numeric"
        />
        <Text style={{ marginBottom: 20 }}>
          Expires {new Date(expirationDate).toLocaleDateString(['en-us'])}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', gap: 15 }}>
        <Button onPress={() => issueEscrow()} text="Sign" />
        <Button
          disabled={!printEnabled}
          onPress={handlePrint}
          primary
          icon="print"
          text="Print"
        />
      </View>
    </PageWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardContainer: { flex: 1, justifyContent: 'space-around' },
  formContainer: {
    marginTop: 20,
    paddingTop: 20,
    width: '100%',
    alignSelf: 'stretch',
    alignItems: 'stretch',
  },
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
