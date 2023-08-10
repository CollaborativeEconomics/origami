import PageWrapper from '@/components/PageWrapper';
import Receipt from '@/components/Receipt';
import TextInput from '@/components/TextInput';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Text, View } from 'react-native';

interface RedeemForm {
  redemptionAmount: string;
}

export default function RedeemWithChange() {
  const {
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<RedeemForm>({
    defaultValues: {
      redemptionAmount: '0',
    },
  });
  const router = useRouter();

  return (
    <PageWrapper>
      <Receipt
        senderName={senderName}
        sender={sender}
        recipient={recipient}
        recipientName={recipientName}
        authorizedPerson={authorizedPerson}
        amount={amount}
        expirationDate={expirationDate}
        qrData={qrDataUrl}
        qrDataWithoutFulfillment={qrDataUrlWithoutFulfillment}
        message={message}
        setBase64Value={setQRBase64}
        setBase64WithoutFulfillment={setQRWithoutFulfillmentBase64}
      />
      <View>
        <Text>Balance: {originalBalance}</Text>
        <Text>Redemption Amount: {redemptionAmount}</Text>
        <Text>New Balance: {newBalance}</Text>
      </View>
      <Controller
        name="redemptionAmount"
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Recipient"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            keyboardType="numeric"
          />
        )}
      />
    </PageWrapper>
  );
}
