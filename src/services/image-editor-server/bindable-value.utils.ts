import { BindableValue } from './image-editor-server.type';

// Client-side mirror of the backend's src/rendering/bindable-value(-resolver).ts,
// used ONLY to drive the WYSIWYG layer editor's live preview (resolving
// variable-bound fields against admin-entered test parameters). It
// deliberately only re-implements this small, self-contained substitution
// step - not the actual canvas/Puppeteer rendering pipeline, which stays
// the backend's sole responsibility (see the "Vorschau rendern" action on
// the version page for a byte-exact preview).

export function isBindableValue(node: unknown): node is BindableValue<unknown> {
  if (typeof node !== 'object' || node === null || Array.isArray(node)) {
    return false;
  }

  const record = node as Record<string, unknown>;
  const keys = Object.keys(record);

  return (
    keys.length === 2 &&
    (record.type === 'constant' || record.type === 'variable') &&
    'value' in record
  );
}

function resolveDotPath(parameters: Record<string, unknown>, path: string): unknown {
  const segments = path.split('.');
  let current: unknown = parameters;

  for (const segment of segments) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined;
    }

    current = (current as Record<string, unknown>)[segment];
  }

  return current;
}

/** Resolves a single BindableValue against test parameters (undefined if a variable path doesn't resolve). */
export function resolveBindableValue<T>(
  bindable: BindableValue<T> | undefined,
  testParameters: Record<string, unknown>,
): T | undefined {
  if (!bindable) {
    return undefined;
  }

  return bindable.type === 'constant' ? bindable.value : (resolveDotPath(testParameters, bindable.value) as T);
}
