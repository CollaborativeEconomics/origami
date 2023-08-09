import { XummPostPayloadBodyJson } from 'xumm-sdk/dist/src/types';
import Card from '@/components/Card';
import PageWrapper from '@/components/PageWrapper';
import TextInput from '@/components/TextInput';
import colors from '@/utils/colors';
import fetchRegistry from '@/utils/fetchRegistry';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// import * as Crypto from 'expo-crypto';
import { toRippleTime, unixTimeToRippleTime, xrpToDrops } from '@/utils/ripple';
import * as WebBrowser from 'expo-web-browser';
import * as Print from 'expo-print';
import { ping, signPayload } from '@/utils/xummApi';
import { useCallback, useEffect, useMemo, useState } from 'react';
import * as Clipboard from 'expo-clipboard';
import * as Camera from 'expo-camera';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Receipt from '@/components/Receipt';
import storage from '@/utils/storage';
import { useMMKVString } from 'react-native-mmkv';
import { parseJwt } from '@/utils/xummVanilla';
import { generateCondition } from '@/utils/generateCondition';
import textToHex from '@/utils/textToHex';
import getReceiptForPrint from '@/utils/getReceiptForPrint';
import useOrigamiStore from '@/store/useOrigamiStore';
// import EscPosPrinter, {
//   getPrinterSeriesByName,
// } from 'react-native-esc-pos-printer';

export interface IssueInput {
  recipient: string;
  authorizedPerson: string;
  message: string;
  amount: string;
}

export default function Issue() {
  const {
    txid,
    recipient: recipientParam,
    ...params
  } = useLocalSearchParams<{
    recipient: string;
    txid: string;
  }>();
  const {
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<IssueInput>({
    defaultValues: {
      recipient: recipientParam,
    },
  });
  const [printEnabled, setPrintEnabled] = useState(false);
  const [expirationDate, setExpirationDate] = useState(
    Date.now() + 1000 * 60 * 60 * 24,
  );
  const [fulfillment, setFulfillment] = useState('');
  const [conditionString, setCondition] = useState('');
  const [QRBase64, setQRBase64] = useState('');
  const router = useRouter();
  const { addTransaction } = useOrigamiStore();

  // initialize
  useEffect(() => {}, []);

  // handle params
  useEffect(() => {
    if (recipientParam) {
      setValue('recipient', recipientParam);
      router.setParams({ recipient: null });
    }
    if (txid) {
      setPrintEnabled(true);
      addTransaction({ txId: txid, fulfillment, condition: conditionString });
      storage.set(
        'tx',
        JSON.stringify({
          txid: txid,
          cid: params.cid,
          id: params.id,
          txblob: params.txblob,
        }),
      );
      // router.setParams({ txid: null, cid: null, id: null, txblob: null });
    }
  }, [txid, recipientParam]);

  const [recipient, authorizedPerson, message, amount] = watch([
    'recipient',
    'authorizedPerson',
    'message',
    'amount',
  ]);

  const { isLoading, error, data } = useQuery({
    queryKey: ['orgByWalletAddress', recipient],
    queryFn: () => fetchRegistry(`organizations?wallet=${recipient}`),
  });

  const recipientName = data?.data?.[0]?.name;

  const [jwt] = useMMKVString('jwt');
  const { sub: sender } = parseJwt(jwt);
  const {
    isLoading: senderIsLoading,
    error: senderError,
    data: senderData,
  } = useQuery({
    queryKey: ['orgByWalletAddress', sender],
    queryFn: () => fetchRegistry(`organizations?wallet=${sender}`),
  });
  const senderName = senderData?.data?.[0]?.name;

  const qrDataUrl = useMemo(
    () =>
      `origami://drawer/redeem?txid=${txid ?? 'txid'}&fulfillment=${
        fulfillment ?? 'fulfillment'
      }&authorizedUser=${authorizedPerson ?? ''}&message=${
        message ?? ''
      }&owner=${sender}&condition=${conditionString}`,
    [txid, fulfillment, authorizedPerson, message, sender, conditionString],
  );

  const handlePrint = () => {
    const html = getReceiptForPrint({
      recipient,
      recipientName,
      sender,
      senderName,
      authorizedPerson,
      amount,
      expirationDate,
      message,
      qrData: QRBase64,
      qrDataUrl,
    });
    Print.printAsync({ html });
  };

  const onSubmit = handleSubmit(async (formData: IssueInput) => {
    const { condition, fulfillmentHex } = await generateCondition(formData);
    setFulfillment(fulfillmentHex);
    setCondition(condition);
    const payload: XummPostPayloadBodyJson = {
      txjson: {
        Account: sender,
        Amount: xrpToDrops(formData.amount),
        CancelAfter: unixTimeToRippleTime(expirationDate),
        // FinishAfter: unixTimeToRippleTime(Date.now() + 1000 * 60),
        Destination: formData.recipient,
        TransactionType: 'EscrowCreate',
        Condition: condition,
        ...(formData.authorizedPerson
          ? {
              Memo: {
                MemoType: textToHex('Authorized Person'),
                MemoData: textToHex(formData.authorizedPerson),
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
  });

  return (
    <PageWrapper style={{ paddingHorizontal: 0 }}>
      <View style={styles.container}>
        <Receipt
          senderName={senderName}
          sender={sender}
          recipient={recipient}
          recipientName={recipientName}
          authorizedPerson={authorizedPerson}
          amount={amount}
          expirationDate={expirationDate}
          qrData={qrDataUrl}
          message={message}
          setBase64Value={setQRBase64}
        />
        <View style={styles.formContainer}>
          <Controller
            name="recipient"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Recipient"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="numeric"
                icons={[
                  {
                    icon: 'camera-alt',
                    onIconPress: async () => {
                      // const text = await Camera.;
                      // onChange(text);
                      router.replace(
                        `/scanQrCode?routeOrigin=/drawer/issue&dataKey=recipient`,
                      );
                    },
                  },
                  {
                    icon: 'content-copy',
                    onIconPress: async () => {
                      const text = await Clipboard.getStringAsync();
                      onChange(text);
                    },
                  },
                ]}
              />
            )}
          />
          <Controller
            name="authorizedPerson"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Authorized Name/ID#"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          <Controller
            name="message"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Message"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          <Controller
            name="amount"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Amount"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="numeric"
              />
            )}
          />
          <Text style={{ marginBottom: 20 }}>
            Expires {new Date(expirationDate).toLocaleDateString(['en-us'])}
          </Text>
          <View style={{ flexDirection: 'row', gap: 15 }}>
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              style={styles.submitButton}
            >
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
