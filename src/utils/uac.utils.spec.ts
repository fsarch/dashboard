import type { TUacMapping } from './configuration.type';

let uacUtils: typeof import('./uac.utils').uacUtils;

beforeAll(async () => {
  uacUtils = (await import('./uac.utils')).uacUtils;
});

describe('uacUtils', () => {
  test('decodeJwtPayload decodes a valid JWT payload', () => {
    const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' }), 'utf8').toString('base64url');
    const payload = Buffer.from(JSON.stringify({ realm_access: { roles: ['dashboard:dev'] } }), 'utf8').toString('base64url');
    const token = `${header}.${payload}.sig`;

    expect(uacUtils.decodeJwtPayload(token)).toEqual({
      realm_access: { roles: ['dashboard:dev'] },
    });
  });

  test('getValueByPath reads nested payload values', () => {
    const value = uacUtils.getValueByPath({ realm_access: { roles: ['dashboard:dev'] } }, 'realm_access.roles');
    expect(value).toEqual(['dashboard:dev']);
  });

  test('evaluateOperator supports includes for arrays', () => {
    expect(uacUtils.evaluateOperator(['dashboard:access', 'dashboard:dev'], 'dashboard:dev', 'includes')).toBe(true);
    expect(uacUtils.evaluateOperator(['dashboard:access'], 'dashboard:dev', 'includes')).toBe(false);
  });

  test('evaluateOperator supports equals', () => {
    expect(uacUtils.evaluateOperator('dashboard:dev', 'dashboard:dev', 'equals')).toBe(true);
    expect(uacUtils.evaluateOperator('dashboard:access', 'dashboard:dev', 'equals')).toBe(false);
  });

  test('isMappingMatch evaluates configured path/operator/value', () => {
    const mapping: TUacMapping = {
      path: 'realm_access.roles',
      value: 'dashboard:dev',
      operator: 'includes',
      permissions: ['dev'],
    };

    expect(uacUtils.isMappingMatch({ realm_access: { roles: ['dashboard:dev'] } }, mapping)).toBe(true);
    expect(uacUtils.isMappingMatch({ realm_access: { roles: ['dashboard:access'] } }, mapping)).toBe(false);
  });
});

