import { XummPostPayloadBodyJson } from 'xumm-sdk/dist/src/types';
import PageWrapper from '@/components/PageWrapper';
import TextInput from '@/components/TextInput';
import colors from '@/utils/colors';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import * as Crypto from 'expo-crypto';
import { unixTimeToRippleTime, xrpToDrops } from '@/utils/ripple';
import * as Print from 'expo-print';
import { signPayload } from '@/utils/xummApi';
import { useCallback, useEffect, useMemo, useState } from 'react';
import * as Clipboard from 'expo-clipboard';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Receipt from '@/components/Receipt';
import { generateCondition } from '@/utils/generateCondition';
import textToHex from '@/utils/textToHex';
import getReceiptForPrint from '@/utils/getReceiptForPrint';
import useOrigamiStore from '@/store/useOrigamiStore';
import useSaveNameByOrgID from '@/utils/useSaveNameByOrgID';

export default function Issue() {
  const {
    setCurrent,
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
      qrData,
      qrDataWithoutFulfillment,
    },
  } = useOrigamiStore();
  const {
    txid: txidParam,
    qrData: recipientParam,
    ...params
  } = useLocalSearchParams<{
    qrData: string;
    txid: string;
  }>();
  const [printEnabled, setPrintEnabled] = useState<boolean>(false);

  const router = useRouter();

  // initialize
  useEffect(() => {}, []);

  // handle params
  useEffect(() => {
    if (recipientParam) {
      setCurrent('recipient', recipientParam);
      router.setParams({ recipient: null });
    }
    if (txidParam) {
      setPrintEnabled(true);
      // router.setParams({ txid: null, cid: null, id: null, txblob: null });
    }
  }, [txidParam, recipientParam]);

  useSaveNameByOrgID(recipient, 'recipientName');
  useSaveNameByOrgID(sender, 'senderName');
  console.log({senderName, recipientName, sender})

  const handlePrint = useCallback(async () => {
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
    const success = await Print.printAsync({ html });
    console.log('print', { success });
  }, [
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
  ]);

  const onSubmit = useCallback(async () => {
    const { conditionHex, fulfillmentHex } = await generateCondition();
    setCurrent('condition', conditionHex);
    setCurrent('fulfillment', fulfillmentHex);
    const payload: XummPostPayloadBodyJson = {
      txjson: {
        Account: sender,
        Amount: xrpToDrops(amount),
        CancelAfter: unixTimeToRippleTime(expirationDate),
        // FinishAfter: unixTimeToRippleTime(Date.now() + 1000 * 60),
        Destination: recipient,
        TransactionType: 'EscrowCreate',
        Condition: condition,
        ...(authorizedPerson
          ? {
              Memo: {
                MemoType: textToHex('MetaData'),
                MemoData: textToHex(
                  JSON.stringify({
                    message,
                    authorizedPerson,
                    senderName,
                    recipientName,
                  }),
                ),
              },
            }
          : {}),
      },
      options: {
        return_url: {
          app: 'origami://drawer/issue?id={id}&cid={cid}&txid={txid}&txblob={txblob}',
          web: 'origami://drawer/issue?id={id}&cid={cid}&txid={txid}&txblob={txblob}',
        },
      },
    };
    signPayload(payload);
  }, []);

  return (
    <PageWrapper style={{ paddingHorizontal: 0 }}>
      <View style={styles.container}>
        <Receipt />
        <View style={styles.formContainer}>
          <TextInput
            label="Recipient"
            value={recipient}
            onChangeText={value => setCurrent('recipient', value)}
            keyboardType="numeric"
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
          <View style={{ flexDirection: 'row', gap: 15 }}>
            <TouchableOpacity onPress={onSubmit} style={styles.submitButton}>
              <Text style={{ color: colors.headerText, textAlign: 'center' }}>
                Sign
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={!printEnabled}
              onPress={handlePrint}
              style={[
                styles.submitButton,
                printEnabled ? {} : styles.disabledButton,
              ]}
            >
              <Text
                style={{
                  color: printEnabled ? colors.headerText : colors.disabledText,
                  textAlign: 'center',
                }}
              >
                Print
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderColor: colors.border,
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
