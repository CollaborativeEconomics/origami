import cc from 'five-bells-condition';

import { IssueInput } from "app/drawer/issue";

export const generateCondition = async (data: IssueInput): Promise<{ condition: string, fulfillmentHex: string }> => {
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

  console.log('====================================');
  console.log({ fulfillmentHex, condition });
  console.log('====================================');
  return { fulfillmentHex, condition };
}