type TContext = {
  dataSource?: Record<string, unknown>;
  [key: string]: unknown;
};

function merge(...args: Array<TContext | undefined>): TContext {
  const result: TContext = {};

  args.forEach((arg) => {
    if (!arg) {
      return;
    }

    Object.entries(arg).forEach(([key, value]) => {
      if (key === 'dataSource' && typeof value === 'object' && value !== null) {
        result[key] = {
          ...(result[key] as Record<string, unknown> || {}),
          ...(value as Record<string, unknown>),
        };
        return;
      }

      result[key] = value;
    });
  });

  return result;
}

export const contextUtils = { merge };
