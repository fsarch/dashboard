import type { TUacMapping } from './configuration.type';

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

function evaluateOperator(pathValue: unknown, expectedValue: string, operator: TUacMapping['operator']): boolean {
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

function isMappingMatch(payload: TDecodedJwtPayload, mapping: TUacMapping): boolean {
  const pathValue = getValueByPath(payload, mapping.path);
  return evaluateOperator(pathValue, mapping.value, mapping.operator);
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
    if (isMappingMatch(payload, mapping)) {
      mapping.permissions.forEach((permission) => permissions.add(permission));
    }
  }

  return [...permissions];
}

async function hasPermission(permission: string, accessToken?: string): Promise<boolean> {
  return (await getPermissions(accessToken)).includes(permission);
}

export const uacUtils = {
  decodeJwtPayload,
  getValueByPath,
  evaluateOperator,
  isMappingMatch,
  getPermissions,
  hasPermission,
};

