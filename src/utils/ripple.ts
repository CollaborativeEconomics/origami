import BigNumber from 'bignumber.js';

const DROPS_PER_XRP = 1000000.0;
const RIPPLE_EPOCH_DIFF = 0x386d4380;
const BASE_TEN = 10;

export function toRippleTime(date: Date) {
  const rippleEpoch = new Date('2000-01-01T00:00:00Z');
  const timeDifferenceInSeconds = Math.floor(
    (date.getTime() - rippleEpoch.getTime()) / 1000,
  );
  return timeDifferenceInSeconds;
}

export function unixTimeToRippleTime(timestamp: number) {
  const rippleTime = Math.round(timestamp / 1000) - RIPPLE_EPOCH_DIFF;
  console.log({ rippleTime });
  return rippleTime;
}

export function xrpToDrops(xrp: string) {
  const drops = new BigNumber(xrp)
    .times(DROPS_PER_XRP)
    .integerValue(BigNumber.ROUND_FLOOR)
    .toString(BASE_TEN);

  console.log({ drops });
  return drops;
}

export function dropsToXrp(drops: string) {
  const xrp = new BigNumber(drops)
    .dividedBy(DROPS_PER_XRP)
    .toString(BASE_TEN);

  console.log({ xrp });
  return xrp;
}