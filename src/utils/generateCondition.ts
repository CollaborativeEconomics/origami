import cc from 'five-bells-condition';
import crypto from 'crypto';

export const generateCondition = async (): Promise<{ conditionHex: string, fulfillmentHex: string }> => {
  const preimageData = crypto.randomBytes(32) as Buffer;
  const fulfillment = new cc.PreimageSha256();
  fulfillment.setPreimage(preimageData);
  const conditionHex = fulfillment
    .getConditionBinary()
    .toString('hex')
    .toUpperCase();
  const fulfillmentHex = fulfillment
    .serializeBinary()
    .toString('hex')
    .toUpperCase();

  console.log('====================================');
  console.log({ fulfillmentHex, conditionHex });
  console.log('====================================');
  return { fulfillmentHex, conditionHex };
}