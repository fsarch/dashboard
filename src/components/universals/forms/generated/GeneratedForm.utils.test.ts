import { jest } from '@jest/globals';
import type { TGeneratedFormDefinition } from '@/components/universals/forms/generated/GeneratedForm.type';
import { ServerLogger } from '@/utils/ServerLogger';

// GeneratedForm.utils.ts calls through to fetchService/getServiceLocalUrl,
// which in turn pull in Next.js server-only boundaries (`server-only`,
// `next/headers`) that don't resolve outside of a real Next.js request.
// Mocking the two modules keeps the test focused on GeneratedForm's own
// evaluation logic and sidesteps that boundary entirely. Module mocks must
// be registered before the module under test is imported, and
// `jest.unstable_mockModule` (unlike `jest.mock`) isn't hoisted, so the
// mocked module has to be loaded dynamically afterwards - see `beforeAll`.
const fetchServiceMock =
  jest.fn<(url: string, init?: RequestInit) => Promise<Response>>();
const getServiceLocalUrlMock = jest.fn<(path: string) => Promise<string>>();

jest.unstable_mockModule('@/utils/fetchService', () => ({
  fetchService: fetchServiceMock,
}));
jest.unstable_mockModule('@/utils/getServiceLocalUrl', () => ({
  getServiceLocalUrl: getServiceLocalUrlMock,
}));

let generatedFormUtils: typeof import('./GeneratedForm.utils')['generatedFormUtils'];

beforeAll(async () => {
  ({ generatedFormUtils } = await import('./GeneratedForm.utils'));
});

beforeEach(() => {
  fetchServiceMock.mockReset();
  getServiceLocalUrlMock.mockReset();
});

const mockJsonResponse = (
  body: unknown,
  { status = 200, ok = true }: { status?: number; ok?: boolean } = {},
) =>
  ({
    ok,
    status,
    statusText: ok ? 'OK' : 'Error',
    headers: {
      get: (name: string) =>
        name === 'Content-Type' ? 'application/json' : null,
    },
    json: async () => body,
  }) as unknown as Response;

const baseDefinition = (
  overrides: Partial<TGeneratedFormDefinition> = {},
): TGeneratedFormDefinition => ({
  inputs: [],
  endpoint: { path: '/v1/entities', method: 'POST' },
  initialValues: {},
  ...overrides,
});

describe('generatedFormUtils.evaluateDefinition', () => {
  it("resolves a select input's datasource into mapped constant options", async () => {
    fetchServiceMock.mockResolvedValue(
      mockJsonResponse([
        { id: 'v1', creationTime: '2026-01-01T00:00:00.000Z' },
      ]),
    );

    const { definition } = await generatedFormUtils.evaluateDefinition(
      baseDefinition({
        inputs: [
          {
            id: 'versionId',
            $type: 'select',
            label: 'Version',
            data: { $type: 'datasource', value: 'versions' },
          },
        ],
        dataSources: {
          versions: {
            $type: 'fetch',
            path: '/v1/versions',
            method: 'GET',
            transformResponse: {
              $type: 'jsonata',
              value:
                '{ "body": [body.{ "id": id, "value": id, "label": id }] }',
            },
          },
        },
      }),
      {},
    );

    expect(fetchServiceMock).toHaveBeenCalledWith(
      '/v1/versions',
      expect.objectContaining({ method: 'GET' }),
    );

    const [selectInput] = definition.inputs;
    expect(selectInput).toMatchObject({
      id: 'versionId',
      data: {
        $type: 'constant',
        value: [{ id: 'v1', value: 'v1', label: 'v1' }],
      },
    });
  });

  it('evaluates initialValues via jsonata using args and dataSource context', async () => {
    fetchServiceMock.mockResolvedValue(mockJsonResponse({ name: 'Widget' }));

    const { definition } = await generatedFormUtils.evaluateDefinition(
      baseDefinition({
        dataSources: {
          product: {
            $type: 'fetch',
            path: '/v1/products/1',
            method: 'GET',
          },
        },
        initialValues: {
          $type: 'jsonata',
          value:
            '{ "projectId": args.projectId, "name": dataSource.product.name }',
        },
      }),
      { args: { projectId: 'p1' } },
    );

    expect(definition.initialValues).toEqual({
      projectId: 'p1',
      name: 'Widget',
    });
  });

  it("falls back to an empty option list (not a crash) when a datasource's transformResponse throws", async () => {
    fetchServiceMock.mockResolvedValue(mockJsonResponse([{ id: 'v1' }]));
    const errorSpy = jest
      .spyOn(ServerLogger.Instance, 'error')
      .mockImplementation(() => undefined);

    const { definition, debugInfo } =
      await generatedFormUtils.evaluateDefinition(
        baseDefinition({
          inputs: [
            {
              id: 'versionId',
              $type: 'select',
              label: 'Version',
              data: { $type: 'datasource', value: 'versions' },
            },
          ],
          dataSources: {
            versions: {
              $type: 'fetch',
              path: '/v1/versions',
              method: 'GET',
              // Invalid JSONata (unbalanced braces) - must not propagate as a
              // thrown exception out of evaluateDefinition.
              transformResponse: { $type: 'jsonata', value: '{ "body": ' },
            },
          },
        }),
        { collectDebugInfo: true },
      );

    expect(definition.inputs[0]).toMatchObject({
      data: { $type: 'constant', value: [] },
    });
    expect(
      debugInfo?.dataSourceResponses.versions.transformation,
    ).toMatchObject({ isError: true });
    // The outer datasource's transformResponse error is a different failure
    // mode (bad JSONata syntax) from the select-array guard, but the select
    // guard still fires on its own account: the datasource ultimately
    // resolved to `null` (the 500-fallback body), which also isn't an array.
    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('did not resolve to an array'),
      expect.objectContaining({ resolvedValueType: 'null' }),
      'GeneratedForm',
    );

    errorSpy.mockRestore();
  });

  it('collects per-datasource debug info (raw + transformed) when collectDebugInfo is true', async () => {
    fetchServiceMock.mockResolvedValue(mockJsonResponse([{ id: 'a' }]));

    const { debugInfo } = await generatedFormUtils.evaluateDefinition(
      baseDefinition({
        dataSources: {
          items: {
            $type: 'fetch',
            path: '/v1/items',
            method: 'GET',
            transformResponse: {
              $type: 'jsonata',
              value: '{ "body": [body.{ "id": id }] }',
            },
          },
        },
      }),
      { collectDebugInfo: true },
    );

    expect(debugInfo?.dataSourceResponses.items).toMatchObject({
      url: '/v1/items',
      method: 'GET',
      status: 200,
      body: { rawJson: [{ id: 'a' }] },
      transformation: {
        isError: false,
        // transformation.output is the full `{ body: ... }` result of the
        // transformResponse expression, not just the `body` array.
        output: { body: [{ id: 'a' }] },
      },
    });
  });

  it('evaluates a link-card input href and its nested paragraph views via jsonata', async () => {
    const { definition } = await generatedFormUtils.evaluateDefinition(
      baseDefinition({
        inputs: [
          {
            id: 'docs',
            $type: 'link-card',
            label: 'Docs',
            href: { $type: 'jsonata', value: "'/projects/' & args.projectId" },
            views: [
              {
                $type: 'section',
                views: [
                  {
                    $type: 'paragraph',
                    text: {
                      $type: 'jsonata',
                      value: "'Project ' & args.projectId",
                    },
                  },
                ],
              },
            ],
          },
        ],
      }),
      { args: { projectId: 'p1' } },
    );

    const [linkCard] = definition.inputs as Array<{
      href?: string;
      views: Array<{ views: Array<{ text: string }> }>;
    }>;
    expect(linkCard.href).toBe('/projects/p1');
    expect(linkCard.views[0].views[0].text).toBe('Project p1');
  });
});

describe('generatedFormUtils.executePostSubmitAction', () => {
  it('evaluates endpoint path/body via jsonata and returns the response on success', async () => {
    fetchServiceMock.mockResolvedValue(
      mockJsonResponse({ id: 'e1', name: 'Created' }, { status: 201 }),
    );

    const result = await generatedFormUtils.executePostSubmitAction(
      baseDefinition({
        endpoint: {
          path: {
            $type: 'jsonata',
            value: "'/v1/projects/' & args.projectId & '/entities'",
          },
          method: 'POST',
          body: { $type: 'jsonata', value: '{ "name": form.name }' },
        },
      }),
      { name: 'Created' },
      { projectId: 'p1' },
    );

    expect(fetchServiceMock).toHaveBeenCalledWith(
      '/v1/projects/p1/entities',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ name: 'Created' }),
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      }),
    );
    expect(result).toEqual({
      response: { status: 201, ok: true, body: { id: 'e1', name: 'Created' } },
      actions: [],
    });
  });

  it('does not evaluate postEndpointActions when the submission failed', async () => {
    fetchServiceMock.mockResolvedValue(
      mockJsonResponse({ message: 'invalid' }, { status: 400, ok: false }),
    );

    const result = await generatedFormUtils.executePostSubmitAction(
      baseDefinition({
        postEndpointActions: [
          {
            $type: 'redirect',
            url: { $type: 'jsonata', value: "'/somewhere'" },
          },
        ],
      }),
      {},
      undefined,
    );

    expect(result).toEqual({
      response: { status: 400, ok: false, body: { message: 'invalid' } },
      actions: [],
    });
    expect(getServiceLocalUrlMock).not.toHaveBeenCalled();
  });

  it("evaluates a redirect action's url using the response body, args, and service.localPath", async () => {
    fetchServiceMock.mockResolvedValue(
      mockJsonResponse({ id: 'e1' }, { status: 201 }),
    );
    getServiceLocalUrlMock.mockResolvedValue('/my-service/svc-1');

    const result = await generatedFormUtils.executePostSubmitAction(
      baseDefinition({
        postEndpointActions: [
          {
            $type: 'redirect',
            url: {
              $type: 'jsonata',
              value:
                "service.localPath & '/entity/' & response.body.id & '/' & args.mode",
            },
          },
        ],
      }),
      {},
      { mode: 'edit' },
    );

    expect(result.actions).toEqual([
      {
        $type: 'redirect',
        url: { $type: 'constant', value: '/my-service/svc-1/entity/e1/edit' },
      },
    ]);
  });

  it('stores file-upload files as-is, or null when none were selected', async () => {
    fetchServiceMock.mockResolvedValue(
      mockJsonResponse({ id: 'e1' }, { status: 201 }),
    );

    const definition = baseDefinition({
      inputs: [{ id: 'attachments', $type: 'file-upload' }],
      endpoint: {
        path: '/v1/entities',
        method: 'POST',
        body: {
          $type: 'jsonata',
          value: '{ "attachments": form.attachments }',
        },
      },
    });

    const emptyFormData: Record<string, unknown> = {
      attachments: { $type: 'files', files: [] },
    };
    await generatedFormUtils.executePostSubmitAction(
      definition,
      emptyFormData,
      undefined,
    );
    expect(emptyFormData.attachments).toBeNull();

    const files = [{ name: 'a.txt', type: 'text/plain', base64: '', size: 1 }];
    const populatedFormData: Record<string, unknown> = {
      attachments: { $type: 'files', files },
    };
    await generatedFormUtils.executePostSubmitAction(
      definition,
      populatedFormData,
      undefined,
    );
    expect(populatedFormData.attachments).toBe(files);
  });
});
