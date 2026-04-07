import { TGeneratedFormDefinition } from '@/components/universals/forms/generated/GeneratedForm.type';

export const FRONTIER_DOMAIN_GROUP_CREATE_FORM: TGeneratedFormDefinition = {
  inputs: [{
    id: 'name',
    $type: 'text',
    label: 'Name',
  }],
  initialValues: { name: '' },
  endpoint: {
    path: '/v1/domain-groups',
    method: 'POST',
    body: { $type: 'jsonata', value: 'form' },
  },
  postEndpointActions: [{
    $type: 'redirect',
    url: {
      $type: 'jsonata',
      value: "service.localPath & '/domain-group/' & response.body.id",
    },
  }],
  buttons: { submitButtonText: 'Domain Group erstellen' },
};

export const FRONTIER_DOMAIN_CREATE_FORM = (domainGroupId: string): TGeneratedFormDefinition => ({
  inputs: [{
    id: 'domainName',
    $type: 'text',
    label: 'Domain-Name',
  }],
  initialValues: { domainName: '' },
  endpoint: {
    path: `/v1/domain-groups/${domainGroupId}/domain`,
    method: 'POST',
    body: { $type: 'jsonata', value: 'form' },
  },
  postEndpointActions: [{
    $type: 'redirect',
    url: {
      $type: 'jsonata',
      value: `service.localPath & '/domain-group/${domainGroupId}'`,
    },
  }],
  buttons: { submitButtonText: 'Domain erstellen' },
});

export const FRONTIER_CACHE_POLICY_CREATE_FORM = (domainGroupId: string): TGeneratedFormDefinition => ({
  inputs: [{
    id: 'name',
    $type: 'text',
    label: 'Name',
  }, {
    id: 'enableCacheTags',
    $type: 'checkbox',
    label: 'Cache-Tags aktivieren',
  }, {
    id: 'cacheTagsHeader',
    $type: 'text',
    label: 'Cache-Tags Header',
  }, {
    id: 'defaultTTL',
    $type: 'number',
    label: 'Standard-TTL (Sekunden)',
  }, {
    id: 'minTTL',
    $type: 'number',
    label: 'Min-TTL (Sekunden)',
  }, {
    id: 'maxTTL',
    $type: 'number',
    label: 'Max-TTL (Sekunden)',
  }, {
    id: 'enableStaleWhileError',
    $type: 'checkbox',
    label: 'Stale While Error aktivieren',
  }, {
    id: 'staleWhileErrorTime',
    $type: 'number',
    label: 'Stale While Error Zeit (Sekunden)',
  }, {
    id: 'enableStaleWhileRevalidate',
    $type: 'checkbox',
    label: 'Stale While Revalidate aktivieren',
  }, {
    id: 'staleWhileRevalidateTime',
    $type: 'number',
    label: 'Stale While Revalidate Zeit (Sekunden)',
  }],
  initialValues: {
    name: '',
    enableCacheTags: false,
    cacheTagsHeader: 'Cache-Tag',
    defaultTTL: 3600,
    minTTL: 0,
    maxTTL: 86400,
    divergenceCookies: [],
    divergenceHeaders: [],
    divergenceQueryParameters: [],
    enableStaleWhileError: false,
    staleWhileErrorTime: 0,
    enableStaleWhileRevalidate: false,
    staleWhileRevalidateTime: 0,
  },
  endpoint: {
    path: `/v1/domain-groups/${domainGroupId}/cache-policies`,
    method: 'POST',
    body: { $type: 'jsonata', value: 'form' },
  },
  postEndpointActions: [{
    $type: 'redirect',
    url: {
      $type: 'jsonata',
      value: `service.localPath & '/domain-group/${domainGroupId}'`,
    },
  }],
  buttons: { submitButtonText: 'Cache Policy erstellen' },
});

export const FRONTIER_PATH_RULE_CREATE_FORM = (domainGroupId: string): TGeneratedFormDefinition => ({
  inputs: [{
    id: 'name',
    $type: 'text',
    label: 'Name',
  }, {
    id: 'path',
    $type: 'text',
    label: 'Pfad-Muster',
  }, {
    id: 'order',
    $type: 'number',
    label: 'Reihenfolge',
  }, {
    id: 'cachePolicyId',
    $type: 'select',
    label: 'Cache Policy',
    enableSearch: true,
    data: {
      $type: 'datasource',
      value: 'cachePolicies',
    },
  }, {
    id: 'upstreamGroupId',
    $type: 'select',
    label: 'Upstream Group',
    enableSearch: true,
    data: {
      $type: 'datasource',
      value: 'upstreamGroups',
    },
  }],
  initialValues: {
    $type: 'jsonata',
    value: `{
      "name": "",
      "path": "/*",
      "order": 0,
      "cachePolicyId": dataSource.cachePolicies[0] ? dataSource.cachePolicies[0].value : "",
      "domainGroupId": "${domainGroupId}",
      "upstreamGroupId": dataSource.upstreamGroups[0] ? dataSource.upstreamGroups[0].value : ""
    }`,
  },
  endpoint: {
    path: `/v1/domain-groups/${domainGroupId}/path-rules`,
    method: 'POST',
    body: { $type: 'jsonata', value: 'form' },
  },
  postEndpointActions: [{
    $type: 'redirect',
    url: {
      $type: 'jsonata',
      value: `service.localPath & '/domain-group/${domainGroupId}'`,
    },
  }],
  dataSources: {
    cachePolicies: {
      $type: 'fetch',
      path: `/v1/domain-groups/${domainGroupId}/cache-policies`,
      method: 'GET',
      transformResponse: {
        $type: 'jsonata',
        value: '{ "body": [body.{ "id": id, "value": id, "label": name }] }',
      },
    },
    upstreamGroups: {
      $type: 'fetch',
      path: `/v1/domain-groups/${domainGroupId}/upstream-groups`,
      method: 'GET',
      transformResponse: {
        $type: 'jsonata',
        value: '{ "body": [body.{ "id": id, "value": id, "label": name }] }',
      },
    },
  },
  buttons: { submitButtonText: 'Path Rule erstellen' },
});

export const FRONTIER_UPSTREAM_GROUP_CREATE_FORM = (domainGroupId: string): TGeneratedFormDefinition => ({
  inputs: [{
    id: 'name',
    $type: 'text',
    label: 'Name',
  }],
  initialValues: { name: '' },
  endpoint: {
    path: `/v1/domain-groups/${domainGroupId}/upstream-groups`,
    method: 'POST',
    body: { $type: 'jsonata', value: 'form' },
  },
  postEndpointActions: [{
    $type: 'redirect',
    url: {
      $type: 'jsonata',
      value: `service.localPath & '/domain-group/${domainGroupId}/upstream-group/' & response.body.id`,
    },
  }],
  buttons: { submitButtonText: 'Upstream Group erstellen' },
});

export const FRONTIER_UPSTREAM_CREATE_FORM = (domainGroupId: string, upstreamGroupId: string): TGeneratedFormDefinition => ({
  inputs: [{
    id: 'name',
    $type: 'text',
    label: 'Name',
  }, {
    id: 'host',
    $type: 'text',
    label: 'Host',
  }, {
    id: 'port',
    $type: 'number',
    label: 'Port',
  }, {
    id: 'path',
    $type: 'text',
    label: 'Pfad',
  }],
  initialValues: { name: '', host: '', port: 80, path: '/' },
  endpoint: {
    path: `/v1/domain-groups/${domainGroupId}/upstream-groups/${upstreamGroupId}/upstream`,
    method: 'POST',
    body: { $type: 'jsonata', value: 'form' },
  },
  postEndpointActions: [{
    $type: 'redirect',
    url: {
      $type: 'jsonata',
      value: `service.localPath & '/domain-group/${domainGroupId}/upstream-group/${upstreamGroupId}'`,
    },
  }],
  buttons: { submitButtonText: 'Upstream erstellen' },
});
