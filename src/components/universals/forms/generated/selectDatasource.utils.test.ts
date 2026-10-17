import { jest } from '@jest/globals';
import { ServerLogger } from '@/utils/ServerLogger';
import { resolveSelectDatasourceOptions } from './selectDatasource.utils';

describe('resolveSelectDatasourceOptions', () => {
  it('returns the array unchanged when the datasource already resolved to an array', () => {
    const errorSpy = jest
      .spyOn(ServerLogger.Instance, 'error')
      .mockImplementation(() => undefined);

    const options = [
      { id: '1', value: '1', label: 'One' },
      { id: '2', value: '2', label: 'Two' },
    ];

    const result = resolveSelectDatasourceOptions(options, {
      inputId: 'currentVersionId',
      dataSourceKey: 'versions',
    });

    expect(result).toBe(options);
    expect(errorSpy).not.toHaveBeenCalled();

    errorSpy.mockRestore();
  });

  it('returns an empty array without logging when the datasource is already an empty array', () => {
    const errorSpy = jest
      .spyOn(ServerLogger.Instance, 'error')
      .mockImplementation(() => undefined);

    const result = resolveSelectDatasourceOptions([], {
      inputId: 'currentVersionId',
      dataSourceKey: 'versions',
    });

    expect(result).toEqual([]);
    expect(errorSpy).not.toHaveBeenCalled();

    errorSpy.mockRestore();
  });

  it('falls back to [] and logs when the datasource collapsed to a bare object (the JSONata singleton-array gotcha)', () => {
    const errorSpy = jest
      .spyOn(ServerLogger.Instance, 'error')
      .mockImplementation(() => undefined);

    // This is exactly what JSONata produces for `body.{ "id": id, ... }`
    // (missing the `[...]` wrapper) when the source list has exactly one
    // element - a bare object instead of a one-element array.
    const collapsedSingleItem = { id: 'v1', value: 'v1', label: 'v1' };

    const result = resolveSelectDatasourceOptions(collapsedSingleItem, {
      inputId: 'currentVersionId',
      dataSourceKey: 'versions',
    });

    expect(result).toEqual([]);
    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('did not resolve to an array'),
      {
        inputId: 'currentVersionId',
        dataSourceKey: 'versions',
        resolvedValueType: 'object',
      },
      'GeneratedForm',
    );

    errorSpy.mockRestore();
  });

  it('falls back to [] and logs when the datasource collapsed to undefined (the empty-list case)', () => {
    const errorSpy = jest
      .spyOn(ServerLogger.Instance, 'error')
      .mockImplementation(() => undefined);

    const result = resolveSelectDatasourceOptions(undefined, {
      inputId: 'currentVersionId',
      dataSourceKey: 'versions',
    });

    expect(result).toEqual([]);
    expect(errorSpy).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ resolvedValueType: 'undefined' }),
      'GeneratedForm',
    );

    errorSpy.mockRestore();
  });

  it('falls back to [] and logs when the datasource resolved to null', () => {
    const errorSpy = jest
      .spyOn(ServerLogger.Instance, 'error')
      .mockImplementation(() => undefined);

    const result = resolveSelectDatasourceOptions(null, {
      inputId: 'currentVersionId',
      dataSourceKey: 'versions',
    });

    expect(result).toEqual([]);
    expect(errorSpy).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ resolvedValueType: 'null' }),
      'GeneratedForm',
    );

    errorSpy.mockRestore();
  });
});
