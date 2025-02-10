/**
 * Returns a random number between min (inclusive) and max (exclusive)
 * @param min
 * @param max
 */
export function randomNumber(min = 0, max = 1000): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Returns a random string of the given length
 * @param length
 * @returns
 */
export function randomString(length = 10): string {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = length; i > 0; --i) result += chars[randomNumber(0, chars.length - 1)];
  return result;
}
