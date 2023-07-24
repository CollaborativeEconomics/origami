export function toRippleTime(date: Date) {
  const rippleEpoch = new Date('2000-01-01T00:00:00Z');
  const timeDifferenceInSeconds = Math.floor(
    (date.getTime() - rippleEpoch.getTime()) / 1000,
  );
  return timeDifferenceInSeconds;
}
