import { ServerLogger } from '@/utils/ServerLogger';

/**
 * Resolves a `select` input's datasource value, guaranteeing an array result.
 *
 * A select's datasource MUST resolve to an array. The most common way this
 * breaks is a JSONata object-constructor mapping over an array (e.g.
 * `body.{ "id": id, ... }`) without wrapping it in `[...]`: JSONata collapses
 * that to a bare object when the input array has exactly one element (and to
 * `undefined` when it has none), which then crashes the
 * Select/SearchableSelect client component instead of failing here where
 * it's actionable.
 */
export const resolveSelectDatasourceOptions = (
  resolvedValue: unknown,
  context: { inputId: string; dataSourceKey: string },
): Array<unknown> => {
  if (Array.isArray(resolvedValue)) {
    return resolvedValue;
  }

  ServerLogger.Instance.error(
    "GeneratedForm select datasource did not resolve to an array - check the datasource's transformResponse (likely missing `[...]` around a JSONata object-constructor mapping)",
    {
      inputId: context.inputId,
      dataSourceKey: context.dataSourceKey,
      resolvedValueType: resolvedValue === null ? 'null' : typeof resolvedValue,
    },
    'GeneratedForm',
  );

  return [];
};
