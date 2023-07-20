import Card from '@/components/Card';
import PageWrapper from '@/components/PageWrapper';
import TextInput from '@/components/TextInput';
import colors from '@/utils/colors';
import fetchRegistry from '@/utils/fetchRegistry';
import XummSdk from '@/utils/xumm';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
  const onSubmit: SubmitHandler<IssueInput> = data => {
    console.log(data);
    XummSdk.payload.create({
      txjson: {
        TransactionType: 'EscrowCreate',
        Account: data.recipient,
        Destination: data.recipient,
        amount: data.amount,
      },
    });
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
