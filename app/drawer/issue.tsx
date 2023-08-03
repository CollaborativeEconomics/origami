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
import crypto from 'crypto';
// import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { toRippleTime, unixTimeToRippleTime, xrpToDrops } from '@/utils/ripple';
import * as WebBrowser from 'expo-web-browser';
import { ping, signPayload } from '@/utils/xummApi';
import cc from 'five-bells-condition';
import { useCallback, useEffect, useState } from 'react';
import * as Clipboard from 'expo-clipboard';
import * as Camera from 'expo-camera';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Receipt from '@/components/Receipt';
import storage from '@/utils/storage';
import { useMMKVString } from 'react-native-mmkv';
import { parseJwt } from '@/utils/xummVanilla';
import EscPosPrinter, {
  getPrinterSeriesByName,
} from 'react-native-esc-pos-printer';

interface IssueInput {
  recipient: string;
  amount: string;
}

export default function Issue() {
  const {
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<IssueInput>();
  const [printEnabled, setPrintEnabled] = useState(false);
  const [expirationDate, setExpirationDate] = useState(
    Date.now() + 1000 * 60 * 60 * 24,
  );
  const router = useRouter();
  const params = useLocalSearchParams();
  console.log({ params });

  // initialize printer
  useEffect(() => {
    const initializePrinters = async () => {
      let printer;
      console.log(Platform.OS);

      const blueToothEnabled = await BluetoothManager.isBluetoothEnabled();
      const devices = await BluetoothManager.scanDevices();
      console.log({ devices });
      // BluetoothManager.connect();

      // EscPosPrinter
      // if (Platform.OS === 'ios') {
      //   const pairingStatus =
      //     await EscPosPrinter.pairingBluetoothPrinter().catch(console.warn);
      //   console.log({ pairingStatus });
      // }
      // // else {
      // const printers = await EscPosPrinter.discover();
      // console.log({ printers });
      // printer = printers[0];
      // }
    };
    initializePrinters();
  }, []);

  // handle params
  useEffect(() => {
    if (params.data) {
      setValue('recipient', params.data);
      router.setParams({ data: null });
    }
    if (params.txid) {
      setPrintEnabled(true);
      storage.set(
        'tx',
        JSON.stringify({
          txid: params.txid,
          cid: params.cid,
          id: params.id,
          txblob: params.txblob,
        }),
      );
      router.setParams({ txid: null, cid: null, id: null, txblob: null });
    }
  }, [params.txid]);

  // console.log(watch('amount')); // watch input value by passing the name of it
  const [recipient, amount] = watch(['recipient', 'amount']);

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

  const onSubmit: SubmitHandler<IssueInput> = async data => {
    console.log(data);

    const preimageData = crypto.randomBytes(32) as Buffer;
    const fulfillment = new cc.PreimageSha256();
    fulfillment.setPreimage(preimageData);
    const condition = fulfillment
      .getConditionBinary()
      .toString('hex')
      .toUpperCase();
    const fulfillmentHex = fulfillment
      .serializeBinary()
      .toString('hex')
      .toUpperCase();
    // Convert the preimage to a hexadecimal string
    // const preimageHex = preimage.toString('hex');

    // Generate the condition as a SHA-256 hash of the preimage
    // let hash = crypto.createHash('sha256');
    // hash.update(preimage);
    // let condition = hash.digest('hex').toUpperCase();
    await SecureStore.setItemAsync('preimage', fulfillmentHex);
    await SecureStore.setItemAsync('condition', condition);
    console.log('====================================');
    console.log({ fulfillmentHex, condition });
    console.log('====================================');
    // await Crypto.digestStringAsync(
    //   Crypto.CryptoDigestAlgorithm.SHA256,
    //   preimage,
    // );
    const options = {
      return_url: {
        app: 'origami://drawer/issue?id={id}&cid={cid}&txid={txid}&txblob={txblob}',
        web: 'origami://drawer/issue?id={id}&cid={cid}&txid={txid}&txblob={txblob}',
      },
    };
    const payload: XummPostPayloadBodyJson = {
      txjson: {
        Account: sender,
        Amount: xrpToDrops(data.amount),
        CancelAfter: unixTimeToRippleTime(expirationDate),
        // FinishAfter: unixTimeToRippleTime(Date.now() + 1000 * 60),
        Destination: data.recipient,
        TransactionType: 'EscrowCreate',
        Condition: condition,
      },
      options,
    };

    signPayload(payload);
  };

  const handlePrint = useCallback(() => {
    router.replace('/drawer/findPrinter');
  }, [printEnabled]);

  return (
    <PageWrapper style={{ paddingHorizontal: 0 }}>
      <View style={styles.container}>
        <View style={styles.cardContainer}>
          {/* <Card organization={'recipientName'} amount={amount} /> */}
          <Receipt
            senderName={senderName}
            sender={sender}
            recipient={recipient}
            recipientName={recipientName}
            amount={amount}
            expirationDate={expirationDate}
          />
        </View>
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
                      router.replace(`/scanQrCode?routeOrigin=/drawer/issue`);
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardContainer: { flex: 1, justifyContent: 'space-around' },
  formContainer: {
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
