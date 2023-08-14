import useOrigamiStore from '@/store/useOrigamiStore';
import React, {
  ForwardRefRenderFunction,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { captureRef } from 'react-native-view-shot';

type QRGeneratorRef = {
  generateQR: () => void;
};

const QRGenerator: ForwardRefRenderFunction<QRGeneratorRef, {}> = (
  _props,
  ref,
) => {
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

  const setQRData = useCallback(async () => {
    const qrData = await captureRef(QRRef, {
      format: 'png',
      quality: 1,
      result: 'base64',
    });
    const qrDataWithoutFulfillment = await captureRef(QRWithoutFulfillmentRef, {
      format: 'png',
      quality: 1,
      result: 'base64',
    });
    return { qrData, qrDataWithoutFulfillment };
  }, [qrDataUrl, qrDataUrlWithoutFulfillment]);

  useImperativeHandle(ref, () => ({
    generateQR: setQRData,
  }));

  return (
    <View style={styles.container}>
      <View ref={QRRef}>
        <QRCode value={qrDataUrl} size={60} />
      </View>
      <View ref={QRWithoutFulfillmentRef}>
        <QRCode value={qrDataUrlWithoutFulfillment} size={60} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // maxHeight: 0,
    position: 'absolute',
    opacity: 0,
  },
});

export default forwardRef(QRGenerator);
