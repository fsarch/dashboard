import { parseMetadataJson, toMetadataJsonValue } from './calendar.utils';

describe('toMetadataJsonValue', () => {
  test('returns an empty string for null/undefined', () => {
    expect(toMetadataJsonValue(null)).toBe('');
    expect(toMetadataJsonValue(undefined)).toBe('');
  });

  test('pretty-prints an object', () => {
    expect(toMetadataJsonValue({ source: 'import' })).toBe('{\n  "source": "import"\n}');
  });
});

describe('parseMetadataJson', () => {
  test('returns undefined for empty/whitespace-only input', () => {
    expect(parseMetadataJson('')).toBeUndefined();
    expect(parseMetadataJson('   ')).toBeUndefined();
  });

  test('parses a valid JSON object', () => {
    expect(parseMetadataJson('{ "source": "import", "tags": ["a", "b"] }')).toEqual({
      source: 'import',
      tags: ['a', 'b'],
    });
  });

  test('throws a user-facing error for invalid JSON', () => {
    expect(() => parseMetadataJson('{ not valid')).toThrow('Metadaten müssen gültiges JSON sein');
  });

  test('throws for a JSON value that is not an object', () => {
    expect(() => parseMetadataJson('[1, 2, 3]')).toThrow('Metadaten müssen ein JSON-Objekt sein');
    expect(() => parseMetadataJson('"just a string"')).toThrow('Metadaten müssen ein JSON-Objekt sein');
    expect(() => parseMetadataJson('42')).toThrow('Metadaten müssen ein JSON-Objekt sein');
    expect(() => parseMetadataJson('null')).toThrow('Metadaten müssen ein JSON-Objekt sein');
  });

  test('round-trips through toMetadataJsonValue', () => {
    const metadata = { source: 'import', nested: { a: 1 } };
    expect(parseMetadataJson(toMetadataJsonValue(metadata))).toEqual(metadata);
  });
});
