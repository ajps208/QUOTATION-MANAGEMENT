export const toCents = (value) => Math.round((Number(value) || 0) * 100);
export const fromCents = (value) => value / 100;
export const clamp = (value, maximum) => Math.max(0, Math.min(value, maximum));

export const safeMultiply = (a, b) => fromCents(toCents(a) * toCents(b));
export const safeDivide = (a, b) => {
  const div = Number(b) || 1;
  return fromCents(toCents(a) / div);
};
export const roundTo = (num, decimals = 2) => {
  const factor = 10 ** decimals;
  return Math.round(Number(num) * factor) / factor;
};
export const toFixedNumber = (num, decimals = 2) => {
  return Number(Number(num).toFixed(decimals));
};
