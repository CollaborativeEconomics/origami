import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

interface Props {
  recipient: string;
  recipientName?: string;
  amount: string;
  sender: string;
  senderName?: string;
  expirationDate: string;
  message?: string;
  qrData: string;
}

const Receipt = ({
  recipient,
  recipientName,
  expirationDate,
  sender,
  senderName,
  message,
  qrData,
  amount,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.largeBoldText}>{recipientName || recipient}</Text>
      {recipientName && <Text>{recipient}</Text>}
      <Text>
        Expires {new Date(expirationDate).toLocaleDateString('en-us')}
      </Text>
      <Text
        style={styles.horizontalLine}
        numberOfLines={1}
        ellipsizeMode="clip"
      >
        ====================================================
      </Text>
      <Text style={styles.extraLargeText}>{amount} XRP</Text>
      <Text
        style={styles.horizontalLine}
        numberOfLines={1}
        ellipsizeMode="clip"
      >
        ====================================================
      </Text>
      <Text>Issued by {senderName || sender}</Text>
      {senderName && <Text>{sender}</Text>}
      <Text>{message}</Text>
      <View style={styles.emptySpace} />
      <View style={{ alignItems: 'center' }}>
        <QRCode value={qrData} size={120} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    width: '80%',
  },
  largeBoldText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  horizontalLine: {
    marginVertical: 10,
  },
  extraLargeText: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptySpace: {
    flex: 1,
    // minHeight: 40,
  },
});

export default Receipt;
