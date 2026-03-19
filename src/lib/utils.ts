/**
 * Returns a promise that resolves after at least `minMs` milliseconds,
 * even if the inner promise resolves faster.
 */
export async function withMinDuration<T>(
  promise: Promise<T>,
  minMs: number
): Promise<T> {
  const [result] = await Promise.all([
    promise,
    new Promise((resolve) => setTimeout(resolve, minMs)),
  ]);
  return result;
}
