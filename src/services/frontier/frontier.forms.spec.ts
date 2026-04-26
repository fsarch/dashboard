let frontierForms: typeof import('./frontier.forms');

describe('frontier forms', () => {
  beforeAll(async () => {
    frontierForms = await import('./frontier.forms');
  });

  test('cache policy create form serializes list fields via jsonata', () => {
    const form = frontierForms.FRONTIER_CACHE_POLICY_CREATE_FORM('group-1');

    expect(form.endpoint.path).toBe('/v1/domain-groups/group-1/cache-policies');
    expect(form.endpoint.method).toBe('POST');
    expect(form.endpoint.body).toEqual({
      $type: 'jsonata',
      value: expect.stringContaining('"divergenceCookies": $reduce(form.divergenceCookies'),
    });

    const nestedFieldIds = form.inputs.map((input) => input.id);
    expect(nestedFieldIds).toEqual(expect.arrayContaining([
      'divergenceCookies',
      'divergenceHeaders',
      'divergenceQueryParameters',
    ]));
  });

  test('cache policy update form uses patch endpoint and nested initial values', () => {
    const form = frontierForms.FRONTIER_CACHE_POLICY_UPDATE_FORM('group-1', 'policy-1', {
      id: 'policy-1',
      name: 'Default policy',
      enableCacheTags: true,
      cacheTagsHeader: 'Cache-Tag',
      defaultTTL: 60,
      minTTL: 10,
      maxTTL: 300,
      divergenceCookies: ['session'],
      divergenceHeaders: ['x-country'],
      divergenceQueryParameters: ['lang'],
      enableStaleWhileError: true,
      staleWhileErrorTime: 15,
      enableStaleWhileRevalidate: true,
      staleWhileRevalidateTime: 30,
    });

    expect(form.endpoint.path).toBe('/v1/domain-groups/group-1/cache-policies/policy-1');
    expect(form.endpoint.method).toBe('PATCH');
    expect(form.initialValues).toMatchObject({
      divergenceCookies: [{ value: 'session' }],
      divergenceHeaders: [{ value: 'x-country' }],
      divergenceQueryParameters: [{ value: 'lang' }],
    });
  });

  test('path rule create form exposes cors fields and keeps service scoped defaults', () => {
    const form = frontierForms.FRONTIER_PATH_RULE_CREATE_FORM('group-1');

    expect(form.endpoint.path).toBe('/v1/domain-groups/group-1/path-rules');
    expect(form.endpoint.method).toBe('POST');
    expect(form.endpoint.body).toEqual({
      $type: 'jsonata',
      value: expect.stringContaining('"corsAllowedOrigins": $reduce(form.corsAllowedOrigins'),
    });
    expect(form.inputs.map((input) => input.id)).toEqual(expect.arrayContaining([
      'corsEnabled',
      'corsAllowCredentials',
      'corsAllowedOrigins',
    ]));
    expect(form.initialValues).toEqual({
      $type: 'jsonata',
      value: expect.stringContaining('"domainGroupId": "group-1"'),
    });
  });
});

