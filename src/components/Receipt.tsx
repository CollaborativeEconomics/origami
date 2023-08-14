import useOrigamiStore from '@/store/useOrigamiStore';
import colors from '@/utils/colors';
import React, { useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { captureRef } from 'react-native-view-shot';

interface Props {
  recipient: string;
  recipientName?: string;
  amount: string;
  sender: string;
  senderName?: string;
  expirationDate: string;
  message?: string;
  authorizedPerson?: string;
  qrData: string;
  setBase64Value: (base64Value: string) => void;
  qrDataWithoutFulfillment: string;
  setBase64WithoutFulfillment: (base64Value: string) => void;
}

const Receipt = () => {
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
    },
  } = useOrigamiStore();
  const QRRef = useRef(null);
  const QRWithoutFulfillmentRef = useRef(null);

  const qrDataUrl = useMemo(
    () =>
      `origami://drawer/redeem?txid=${txid}&fulfillment=${fulfillment}&authorizedPerson=${
        authorizedPerson ?? ''
      }&message=${message ?? ''}&owner=${sender}&condition=${condition}`,
    [txid, fulfillment, authorizedPerson, message, sender, condition],
  );
  const qrDataUrlWithoutFulfillment = useMemo(
    () =>
      `origami://drawer/redeem?txid=${txid}&authorizedPerson=${
        authorizedPerson ?? ''
      }&message=${message ?? ''}&owner=${sender}&condition=${condition}`,
    [txid, authorizedPerson, message, sender, condition],
  );

  useEffect(() => {
    captureRef(QRRef, {
      format: 'png',
      quality: 1,
      result: 'base64',
    }).then(base64 => setCurrent('qrData', base64));
    captureRef(QRWithoutFulfillmentRef, {
      format: 'png',
      quality: 1,
      result: 'base64',
    }).then(base64 => setCurrent('qrDataWithoutFulfillment', base64));
  }, [qrDataUrl, qrDataUrlWithoutFulfillment]);

  return (
    <View style={styles.container}>
      <Text>Issued to</Text>
      <Text style={styles.largeBoldText}>
        {recipientName || recipient}
        {recipientName && <Text>{recipient}</Text>}
      </Text>
      <Text>Issued by</Text>
      <Text style={styles.textRow}>
        {' '}
        {senderName || sender}
        {senderName && <Text>{sender}</Text>}
      </Text>
      <Text style={styles.textRow}>
        Expires {new Date(expirationDate).toLocaleDateString('en-us')}
      </Text>
      <Text style={[styles.textRow, styles.amountText]}>{amount ?? 0} XRP</Text>
      {authorizedPerson && <Text>ID Required for {authorizedPerson}</Text>}
      <Text style={styles.textRow}>{message}</Text>
      <View style={{ alignItems: 'center' }}>
        <View
          style={{
            alignSelf: 'stretch',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            gap: 20,
          }}
        >
          <View style={styles.qrWrapper} ref={QRRef}>
            <QRCode value={qrDataUrl} size={60} />
          </View>
          <View style={styles.qrWrapper} ref={QRWithoutFulfillmentRef}>
            <QRCode value={qrDataUrlWithoutFulfillment} size={60} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    width: '100%',
  },
  largeBoldText: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  horizontalLine: {
    marginVertical: 10,
  },
  amountText: {
    textAlign: 'right',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  textRow: {
    marginBottom: 5,
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  qrWrapper: { marginBottom: 20 },
});

export default Receipt;
