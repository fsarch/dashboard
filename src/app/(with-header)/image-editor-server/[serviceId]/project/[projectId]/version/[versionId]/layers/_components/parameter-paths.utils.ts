import { ParameterDto, ParameterType } from '@/services/image-editor-server/image-editor-server.type';

export type TFlattenedParameterPath = { path: string; type: ParameterType; label: string };

/**
 * Flattens a version's Parameter tree (flat rows linked by parentId, see
 * the backend's Parameter entity) into dot-paths usable as
 * VariableBindableValue.value - e.g. an "address" object parameter with a
 * "city" child becomes the path "address.city". Only leaf (non-object)
 * parameters are returned, since only they hold an actual bindable value.
 */
export function flattenParameterPaths(parameters: ParameterDto[]): TFlattenedParameterPath[] {
  const childrenByParentId = new Map<string, ParameterDto[]>();

  for (const parameter of parameters) {
    const key = parameter.parentId ?? 'root';
    const bucket = childrenByParentId.get(key) ?? [];
    bucket.push(parameter);
    childrenByParentId.set(key, bucket);
  }

  const result: TFlattenedParameterPath[] = [];

  function walk(parentKey: string, prefix: string) {
    const children = [...(childrenByParentId.get(parentKey) ?? [])].sort((a, b) => a.order - b.order);

    for (const child of children) {
      const path = prefix ? `${prefix}.${child.name}` : child.name;

      if (child.type === 'object') {
        walk(child.id, path);
      } else {
        result.push({ path, type: child.type, label: path });
      }
    }
  }

  walk('root', '');

  return result;
}
