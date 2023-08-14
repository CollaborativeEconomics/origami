import useOrigamiStore, { Transaction } from '@/store/useOrigamiStore';
import { generateCondition } from './generateCondition';
import { unixTimeToRippleTime, xrpToDrops } from './ripple';
import textToHex from './textToHex';
import { signPayload } from './xummApi';
import { XummPostPayloadBodyJson } from 'xumm-sdk/dist/src/types';

const issueEscrow = async (overrides: Partial<Transaction> = {}) => {
  const { currentTransaction, setCurrent } = useOrigamiStore.getState();
  const {
    amount,
    expirationDate,
    message,
    authorizedPerson,
    senderName,
    recipientName,
    sender,
    recipient,
  } = { ...currentTransaction, ...overrides };
  console.log({ overrides, recipient });
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
      Condition: conditionHex,
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
    },
    options: {
      return_url: {
        app: 'origami://drawer/issue?id={id}&cid={cid}&txid={txid}&txblob={txblob}',
        web: 'origami://drawer/issue?id={id}&cid={cid}&txid={txid}&txblob={txblob}',
      },
    },
  };
  signPayload(payload);
};

export default issueEscrow;
