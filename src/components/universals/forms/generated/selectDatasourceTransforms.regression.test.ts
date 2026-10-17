import jsonata from 'jsonata';
import { UPDATE_PROJECT_FORM } from '@/app/(with-header)/frontend/[serviceId]/project/[projectId]/_forms/update-project.form';
import { AGGREGATION_MODE_UPDATE_FORM } from '@/app/(with-header)/watchtower/[serviceId]/aggregation-mode/[aggregationModeId]/_forms/aggregation-mode-update.form';
import { SCOPE_TYPE_CREATE_FORM } from '@/app/(with-header)/watchtower/[serviceId]/scope-type/_forms/scope-type-create.form';
import type { TGeneratedFormDefinition } from '@/components/universals/forms/generated/GeneratedForm.type';

// Regression coverage for the JSONata "singleton array" gotcha: an object
// constructor mapped over an array (e.g. `body.{ "id": id, ... }`) collapses
// to a bare object - not a one-element array - when the source has exactly
// one element, and to `undefined` when it has none. Only wrapping the
// mapping in `[...]` keeps it an array regardless of item count. This file
// exercises the actual `transformResponse` expressions of every
// GeneratedForm whose select previously crashed on real data (one project
// version / one scope data type / one aggregation mode type), so a future
// edit that drops the `[...]` wrapper fails these tests instead of only
// showing up in production.

const evaluateTransformResponse = async (
  definition: TGeneratedFormDefinition,
  dataSourceKey: string,
  rawData: unknown,
): Promise<unknown> => {
  const dataSource = definition.dataSources?.[dataSourceKey];
  if (!dataSource?.transformResponse) {
    throw new Error(
      `datasource "${dataSourceKey}" has no transformResponse to test`,
    );
  }

  const result = (await jsonata(dataSource.transformResponse.value).evaluate({
    status: 200,
    statusText: 'OK',
    body: rawData,
  })) as { body: unknown };

  return result.body;
};

describe('GeneratedForm select datasource transforms always produce an array body', () => {
  it('UPDATE_PROJECT_FORM "versions" datasource (plain array API response)', async () => {
    const oneVersion = [{ id: 'v1', creationTime: '2026-09-26T15:32:46.522Z' }];
    const manyVersions = [
      { id: 'v1', creationTime: '2026-09-26T15:32:46.522Z' },
      { id: 'v2', creationTime: '2026-10-01T09:00:00.000Z' },
    ];

    await expect(
      evaluateTransformResponse(UPDATE_PROJECT_FORM, 'versions', []),
    ).resolves.toEqual([]);

    await expect(
      evaluateTransformResponse(UPDATE_PROJECT_FORM, 'versions', oneVersion),
    ).resolves.toEqual([
      { id: 'v1', value: 'v1', label: 'v1 (2026-09-26T15:32:46.522Z)' },
    ]);

    await expect(
      evaluateTransformResponse(UPDATE_PROJECT_FORM, 'versions', manyVersions),
    ).resolves.toHaveLength(2);
  });

  it('SCOPE_TYPE_CREATE_FORM "scopeDataTypes" datasource (paginated { data, metadata } API response)', async () => {
    const paginated = (data: Array<{ id: number; name: string }>) => ({
      data,
      metadata: { page: 1, pageSize: 100, total: data.length },
    });

    await expect(
      evaluateTransformResponse(
        SCOPE_TYPE_CREATE_FORM,
        'scopeDataTypes',
        paginated([]),
      ),
    ).resolves.toEqual([]);

    // Only `value` needs coercing to a string for the select; `id` (used as
    // React's list key) is passed through as-is, numeric or not.
    await expect(
      evaluateTransformResponse(
        SCOPE_TYPE_CREATE_FORM,
        'scopeDataTypes',
        paginated([{ id: 1, name: 'IP' }]),
      ),
    ).resolves.toEqual([{ id: 1, value: '1', label: 'IP' }]);

    await expect(
      evaluateTransformResponse(
        SCOPE_TYPE_CREATE_FORM,
        'scopeDataTypes',
        paginated([
          { id: 1, name: 'IP' },
          { id: 2, name: 'ASN' },
        ]),
      ),
    ).resolves.toHaveLength(2);
  });

  it('AGGREGATION_MODE_UPDATE_FORM "aggregationModeTypes" datasource (paginated { data, metadata } API response)', async () => {
    const paginated = (data: Array<{ id: string; name: string }>) => ({
      data,
      metadata: { page: 1, pageSize: 100, total: data.length },
    });

    await expect(
      evaluateTransformResponse(
        AGGREGATION_MODE_UPDATE_FORM,
        'aggregationModeTypes',
        paginated([]),
      ),
    ).resolves.toEqual([]);

    await expect(
      evaluateTransformResponse(
        AGGREGATION_MODE_UPDATE_FORM,
        'aggregationModeTypes',
        paginated([{ id: 'sum', name: 'SUM' }]),
      ),
    ).resolves.toEqual([{ id: 'sum', value: 'sum', label: 'SUM' }]);

    await expect(
      evaluateTransformResponse(
        AGGREGATION_MODE_UPDATE_FORM,
        'aggregationModeTypes',
        paginated([
          { id: 'sum', name: 'SUM' },
          { id: 'max', name: 'MAX' },
        ]),
      ),
    ).resolves.toHaveLength(2);
  });
});
