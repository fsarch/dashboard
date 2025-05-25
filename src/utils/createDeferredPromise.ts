export function createDeferredPromise<TResult>() {
  let resolve: (value: TResult) => void;
  let reject: (error: Error) => void;

  const promise = new Promise<TResult>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return {
    resolve: resolve!,
    reject: reject!,
    value: promise,
  }
}
