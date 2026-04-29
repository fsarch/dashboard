import type {
  EServiceType,
  TUacComparisonOperator,
  TUacMapMapping,
  TUacMapping,
  TUacPermission,
} from './configuration.type';

type TDecodedJwtPayload = Record<string, unknown>;

function decodeJwtPayload(accessToken: string): TDecodedJwtPayload | null {
  const parts = accessToken.split('.');
  if (parts.length < 2) {
    return null;
  }

  try {
    const payloadJson = Buffer.from(parts[1], 'base64url').toString('utf8');
    const payload = JSON.parse(payloadJson);
    if (!payload || typeof payload !== 'object') {
      return null;
    }

    return payload as TDecodedJwtPayload;
  } catch {
    return null;
  }
}

function getValueByPath(payload: TDecodedJwtPayload, path: string): unknown {
  return path
    .split('.')
    .reduce<unknown>((currentValue, key) => {
      if (currentValue === null || typeof currentValue !== 'object') {
        return undefined;
      }

      return (currentValue as Record<string, unknown>)[key];
    }, payload);
}

function evaluateOperator(pathValue: unknown, expectedValue: string, operator: TUacComparisonOperator): boolean {
  if (operator === 'includes') {
    if (Array.isArray(pathValue)) {
      return pathValue.some((value) => `${value}` === expectedValue);
    }

    if (typeof pathValue === 'string') {
      return pathValue.includes(expectedValue);
    }

    return false;
  }

  if (operator === 'equals') {
    return `${pathValue}` === expectedValue;
  }

  return false;
}

function getMapPathTokens(pathValue: unknown): string[] {
  if (Array.isArray(pathValue)) {
    return pathValue.map((value) => `${value}`);
  }

  if (typeof pathValue === 'string' || typeof pathValue === 'number' || typeof pathValue === 'boolean') {
    return [`${pathValue}`];
  }

  if (pathValue && typeof pathValue === 'object') {
    return Object.keys(pathValue as Record<string, unknown>);
  }

  return [];
}

function resolveMapPermissions(pathValue: unknown, mapMappings: TUacMapMapping['mappings']): TUacPermission[] {
  const mapKeys = new Set(getMapPathTokens(pathValue));

  const permissions: TUacPermission[] = [];
  for (const mapping of mapMappings) {
    if (mapKeys.has(mapping.key)) {
      permissions.push(...mapping.permissions);
    }
  }

  return permissions;
}

function isMappingMatch(payload: TDecodedJwtPayload, mapping: TUacMapping): boolean {
  const pathValue = getValueByPath(payload, mapping.path);
  if (mapping.operator === 'map') {
    return resolveMapPermissions(pathValue, mapping.mappings).length > 0;
  }

  return evaluateOperator(pathValue, mapping.value, mapping.operator);
}

function resolvePermissionsFromMapping(payload: TDecodedJwtPayload, mapping: TUacMapping): TUacPermission[] {
  const pathValue = getValueByPath(payload, mapping.path);

  if (mapping.operator === 'map') {
    return resolveMapPermissions(pathValue, mapping.mappings);
  }

  if (evaluateOperator(pathValue, mapping.value, mapping.operator)) {
    return mapping.permissions;
  }

  return [];
}

function isAppPermission(permission: TUacPermission): permission is Extract<TUacPermission, { type: 'app' }> {
  return typeof permission === 'object' && permission !== null && permission.type === 'app';
}

function hasMatchingAppPermission(
  appPermissions: Array<Extract<TUacPermission, { type: 'app' }>>,
  serviceType: EServiceType,
  serviceId: string,
): boolean {
  return appPermissions.some((permission) => {
    const isMatchingType = permission.value.type === '*' || permission.value.type === serviceType;
    const isMatchingId = permission.value.id === '*' || permission.value.id === serviceId;

    return isMatchingType && isMatchingId;
  });
}

async function getPermissions(accessToken?: string): Promise<string[]> {
  const { getConfiguration } = await import('./configuration.utils');
  const { getAccessToken } = await import('./getAccessToken');

  const configuration = await getConfiguration();
  const token = accessToken ?? await getAccessToken();

  if (!configuration.uac || !token) {
    return [];
  }

  const payload = decodeJwtPayload(token);
  if (!payload) {
    return [];
  }

  const permissions = new Set<string>();
  for (const mapping of configuration.uac.mappings) {
    for (const permission of resolvePermissionsFromMapping(payload, mapping)) {
      if (typeof permission === 'string') {
        permissions.add(permission);
      }
    }
  }

  return [...permissions];
}

async function getAppPermissions(accessToken?: string): Promise<Array<Extract<TUacPermission, { type: 'app' }>>> {
  const { getConfiguration } = await import('./configuration.utils');
  const { getAccessToken } = await import('./getAccessToken');

  const configuration = await getConfiguration();
  const token = accessToken ?? await getAccessToken();

  if (!configuration.uac || !token) {
    return [];
  }

  const payload = decodeJwtPayload(token);
  if (!payload) {
    return [];
  }

  const appPermissionsByKey = new Map<string, Extract<TUacPermission, { type: 'app' }>>();
  for (const mapping of configuration.uac.mappings) {
    for (const permission of resolvePermissionsFromMapping(payload, mapping)) {
      if (isAppPermission(permission)) {
        const key = `${permission.value.type}:${permission.value.id}`;
        appPermissionsByKey.set(key, permission);
      }
    }
  }

  return [...appPermissionsByKey.values()];
}

async function hasPermission(permission: string, accessToken?: string): Promise<boolean> {
  return (await getPermissions(accessToken)).includes(permission);
}

async function hasAppPermission(serviceType: EServiceType, serviceId: string, accessToken?: string): Promise<boolean> {
  const { getConfiguration } = await import('./configuration.utils');

  const configuration = await getConfiguration();
  if (!configuration.uac) {
    return true;
  }

  return hasMatchingAppPermission(await getAppPermissions(accessToken), serviceType, serviceId);
}

export const uacUtils = {
  decodeJwtPayload,
  getValueByPath,
  evaluateOperator,
  getMapPathTokens,
  resolveMapPermissions,
  isMappingMatch,
  resolvePermissionsFromMapping,
  isAppPermission,
  hasMatchingAppPermission,
  getPermissions,
  getAppPermissions,
  hasPermission,
  hasAppPermission,
};

