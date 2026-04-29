import { EServiceType, type TUacMapping } from './configuration.type';

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

  test('resolveMapPermissions supports map operator mappings', () => {
    const permissions = uacUtils.resolveMapPermissions(['material-tracing:access', 'foo'], [{
      key: 'material-tracing:access',
      permissions: [{
        type: 'app',
        value: {
          type: EServiceType.MATERIAL_TRACING,
          id: 'mat-main',
        },
      }],
    }]);

    expect(permissions).toEqual([{
      type: 'app',
      value: {
        type: EServiceType.MATERIAL_TRACING,
        id: 'mat-main',
      },
    }]);
  });

  test('resolvePermissionsFromMapping returns mapped permissions for map operator', () => {
    const mapping: TUacMapping = {
      path: 'realm_access.roles',
      operator: 'map',
      mappings: [{
        key: 'material-tracing:access',
        permissions: [{
          type: 'app',
          value: {
            type: EServiceType.MATERIAL_TRACING,
            id: 'mat-main',
          },
        }],
      }],
    };

    const permissions = uacUtils.resolvePermissionsFromMapping({
      realm_access: {
        roles: ['material-tracing:access'],
      },
    }, mapping);

    expect(permissions).toHaveLength(1);
    expect(uacUtils.isAppPermission(permissions[0])).toBe(true);
  });

  test('hasMatchingAppPermission supports wildcard matching', () => {
    const hasWildcardPermission = uacUtils.hasMatchingAppPermission([{
      type: 'app',
      value: {
        type: '*',
        id: '*',
      },
    }], EServiceType.PRINTER, 'printer-main');

    const hasSpecificPermission = uacUtils.hasMatchingAppPermission([{
      type: 'app',
      value: {
        type: EServiceType.PRINTER,
        id: 'printer-main',
      },
    }], EServiceType.PRINTER, 'printer-main');

    const hasNoPermission = uacUtils.hasMatchingAppPermission([{
      type: 'app',
      value: {
        type: EServiceType.PRINTER,
        id: 'other-printer',
      },
    }], EServiceType.PRINTER, 'printer-main');

    expect(hasWildcardPermission).toBe(true);
    expect(hasSpecificPermission).toBe(true);
    expect(hasNoPermission).toBe(false);
  });
});

