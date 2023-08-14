import Button from '@/components/Button';
import PageWrapper from '@/components/PageWrapper';
import Receipt from '@/components/Receipt';
import TextInput from '@/components/TextInput';
import useOrigamiStore from '@/store/useOrigamiStore';
import colors from '@/utils/colors';
import issueEscrow from '@/utils/issueEscrow';
import { dropsToXrp } from '@/utils/ripple';
import { getTransaction } from '@/utils/xummApi';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface RedeemForm {
  redemptionAmount: string;
}

export default function IssueChange() {
  const [amount, setAmount] = useState<string>('');
  const {
    currentTransaction: {
      amount: originalBalance,
      sender,
      senderName,
      txid,
      rawTransaction,
    },
    setCurrent,
  } = useOrigamiStore();
  console.log({ originalBalance, sender, senderName, txid, rawTransaction });

  const issueBalance = useCallback(() => {
    // setCurrent('amount', amount);
    issueEscrow({
      amount,
      // Because we are the redeemer, we are also the recipient
      // I.e. we're issuing the voucher back to ourselves
      recipient: sender,
      recipientName: senderName,
    });
  }, [amount]);

  useEffect(() => {
    if (txid) {
      console.log('fetching transaction', txid);
      getTransaction(txid).then(transaction => {
        console.log({ transaction });
        setCurrent('amount', dropsToXrp(transaction.result.Amount));
        setCurrent('rawTransaction', dropsToXrp(transaction.result));
      });
    }
  }, [txid]);

  return (
    <PageWrapper>
      <View>
        <View style={styles.textRowContainer}>
          <View style={styles.rowWrapper}>
            <Text>Balance:</Text>
            <Text>{originalBalance}</Text>
          </View>
          <View style={styles.rowWrapper}>
            <Text>Redemption Amount:</Text>
            <Text>{amount}</Text>
          </View>
          <View style={[styles.rowWrapper, styles.rowWrappeLast]}>
            <Text>New Balance:</Text>
            <Text>{+originalBalance - +amount}</Text>
          </View>
        </View>
      </View>
      <View>
        <TextInput
          label="Redemption Amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
        <Button onPress={issueBalance} text="Issue Balance" primary />
      </View>
    </PageWrapper>
  );
}

const styles = StyleSheet.create({
  textRowContainer: {
    marginTop: 40,
    borderColor: colors.border,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    marginVertical: 20,
  },
  rowWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowWrappeLast: {
    borderBottomWidth: 0,
  },
});
