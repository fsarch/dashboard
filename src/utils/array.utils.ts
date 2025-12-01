/**
 * Async version of Array.prototype.reduce. Supports async reducer functions.
 * Behaves like the synchronous reduce: if `initial` is omitted, the first element
 * of the array is used as the initial accumulator and iteration starts at index 1.
 *
 * @example
 * const sum = await asyncReduce([1,2,3], async (acc, n) => acc + n, 0);
 *
 * @throws {TypeError} If array is empty and no initial value is provided.
 */
async function asyncReduce<T, U>(
  arr: ReadonlyArray<T>,
  reducer: (acc: U, cur: T, index: number, array: ReadonlyArray<T>) => U | Promise<U>,
  initial: U
): Promise<U>;

async function asyncReduce<T>(
  arr: ReadonlyArray<T>,
  reducer: (acc: T, cur: T, index: number, array: ReadonlyArray<T>) => T | Promise<T>
): Promise<T>;

async function asyncReduce<T, U>(
  arr: ReadonlyArray<T>,
  reducer: (acc: any, cur: T, index: number, array: ReadonlyArray<T>) => any | Promise<any>,
  initial?: any
): Promise<any> {
  if (arr.length === 0 && initial === undefined) {
    throw new TypeError('Reduce of empty array with no initial value');
  }

  let i: number;
  let acc: any;

  if (initial === undefined) {
    // Use first element as accumulator
    acc = arr[0] as any;
    i = 1;
  } else {
    acc = initial;
    i = 0;
  }

  for (; i < arr.length; i++) {
    // await reducer because it might return a Promise
    acc = await reducer(acc, arr[i], i, arr);
  }

  return acc;
}

export const arrayUtils = {
  asyncReduce,
};
