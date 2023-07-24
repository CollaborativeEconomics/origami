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
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import crypto from 'crypto';
// import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { toRippleTime } from '@/utils/ripple';
import * as WebBrowser from 'expo-web-browser';
import { signPayload } from '@/utils/xummApi';

interface IssueInput {
  recipient: string;
  amount: string;
}

export default function Issue() {
  const {
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<IssueInput>();
  const onSubmit: SubmitHandler<IssueInput> = async data => {
    console.log(data);

    const preimage = crypto.randomBytes(32) as Buffer;
    // Convert the preimage to a hexadecimal string
    const preimageHex = preimage.toString('hex');

    // Generate the condition as a SHA-256 hash of the preimage
    let hash = crypto.createHash('sha256');
    hash.update(preimage);
    let condition = hash.digest('hex');
    await SecureStore.setItemAsync('preimage', preimageHex);
    await SecureStore.setItemAsync('condition', condition);
    console.log('====================================');
    console.log({ preimageHex, condition });
    console.log('====================================');
    // await Crypto.digestStringAsync(
    //   Crypto.CryptoDigestAlgorithm.SHA256,
    //   preimage,
    // );
    const payload: XummPostPayloadBodyJson = {
      txjson: {
        TransactionType: 'EscrowCreate',
        Account: data.recipient,
        Destination: data.recipient,
        Amount: data.amount,
        Condition: condition,
        CancelAfter: toRippleTime(new Date(Date.now() + 1000 * 60 * 60 * 24)),
      },
      options: {
        return_url: {
          app: 'origami://?id={id}&cid={cid}&txid={txid}&txblob={txblob}',
          web: 'origami://?id={id}&cid={cid}&txid={txid}&txblob={txblob}',
        },
      },
    };
    signPayload(payload);
    // const subscription = await XummSdk.payload
    //   .createAndSubscribe(payload, event => {
    //     console.log({ event });
    //     if (event.data.signed === true) {
    //       console.log('successfully signed!');
    //       return event.data;
    //     }
    //     if (event.data.signed === false) {
    //       console.log('uh oh, rejected!');
    //     }
    //   })
    //   .catch(err => console.warn('payload error', err));
    // console.log({ subscription });
    // if (subscription) {
    //   const stuff = await WebBrowser.openAuthSessionAsync(
    //     subscription.created.next.always,
    //   );
    //   console.log({ stuff });
    // }
  };
  // console.log(watch('amount')); // watch input value by passing the name of it
  const [recipient, amount] = watch(['recipient', 'amount']);

  const { isLoading, error, data } = useQuery({
    queryKey: ['orgByWalletAddress', recipient],
    queryFn: () => fetchRegistry(`organizations?wallet=${recipient}`),
  });

  const orgName = data?.data?.[0]?.name;

  // console.log(Object.keys(data));

  return (
    <PageWrapper style={{ paddingHorizontal: 0 }}>
      <View style={styles.container}>
        <View style={styles.cardContainer}>
          <Card organization={orgName} amount={amount} />
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
          <Text style={{ marginBottom: 20 }}>Expires 12/24/24</Text>
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            style={styles.submitButton}
          >
            <Text style={{ color: colors.headerText, textAlign: 'center' }}>
              Issue
            </Text>
          </TouchableOpacity>
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
    backgroundColor: colors.background,
    paddingVertical: 20,
    borderRadius: 17,
  },
});
