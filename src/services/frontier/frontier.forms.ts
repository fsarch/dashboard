import {
  TGeneratedFormDefinition,
  TGeneratedFormInput,
} from '@/components/universals/forms/generated/GeneratedForm.type';
import { CachePolicyDto, CorsPolicyDto, LogPolicyDto, PathRuleDto } from '@/services/frontier/frontier.type';

const createStringArrayInput = (id: string, label: string, itemLabel: string): TGeneratedFormInput => ({
  id,
  $type: 'nested-form',
  label,
  isArray: true,
  addInitialValues: {
    value: '',
  },
  inputs: [{
    id: 'value',
    $type: 'text',
    label: itemLabel,
  }],
});

const mapStringArrayToNestedForm = (values: string[] = []) => values.map((value) => ({ value }));

const FRONTIER_CACHE_POLICY_BODY = `{
  "name": form.name,
  "enableCacheTags": form.enableCacheTags,
  "cacheTagsHeader": form.cacheTagsHeader,
  "defaultTTL": form.defaultTTL,
  "minTTL": form.minTTL,
  "maxTTL": form.maxTTL,
  "divergenceCookies": $reduce(form.divergenceCookies, function($acc, $item) { $append($acc, $item.value) }, []),
  "divergenceHeaders": $reduce(form.divergenceHeaders, function($acc, $item) { $append($acc, $item.value) }, []),
  "divergenceQueryParameters": $reduce(form.divergenceQueryParameters, function($acc, $item) { $append($acc, $item.value) }, []),
  "enableStaleWhileError": form.enableStaleWhileError,
  "staleWhileErrorTime": form.staleWhileErrorTime,
  "enableStaleWhileRevalidate": form.enableStaleWhileRevalidate,
  "staleWhileRevalidateTime": form.staleWhileRevalidateTime
}`;

const FRONTIER_PATH_RULE_BODY = `{
  "name": form.name,
  "path": form.path,
  "cachePolicyId": form.cachePolicyId,
  "upstreamGroupId": form.upstreamGroupId,
  "order": form.order,
  "corsPolicyId": form.corsPolicyId ? form.corsPolicyId : undefined,
  "logPolicyId": form.logPolicyId ? form.logPolicyId : undefined
}`;

const FRONTIER_CACHE_POLICY_INPUTS: TGeneratedFormDefinition['inputs'] = [{
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
}, createStringArrayInput('divergenceCookies', 'Divergence Cookies', 'Cookie'), createStringArrayInput('divergenceHeaders', 'Divergence Headers', 'Header'), createStringArrayInput('divergenceQueryParameters', 'Divergence Query Parameters', 'Query-Parameter'), {
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
}];

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
  inputs: FRONTIER_CACHE_POLICY_INPUTS,
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
    body: { $type: 'jsonata', value: FRONTIER_CACHE_POLICY_BODY },
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

export function FRONTIER_CACHE_POLICY_UPDATE_FORM(
  domainGroupId: string,
  cachePolicyId: string,
  cachePolicy: CachePolicyDto,
): TGeneratedFormDefinition {
  return {
    inputs: FRONTIER_CACHE_POLICY_INPUTS,
    initialValues: {
      name: cachePolicy.name,
      enableCacheTags: cachePolicy.enableCacheTags,
      cacheTagsHeader: cachePolicy.cacheTagsHeader,
      defaultTTL: cachePolicy.defaultTTL,
      minTTL: cachePolicy.minTTL,
      maxTTL: cachePolicy.maxTTL,
      divergenceCookies: mapStringArrayToNestedForm(cachePolicy.divergenceCookies),
      divergenceHeaders: mapStringArrayToNestedForm(cachePolicy.divergenceHeaders),
      divergenceQueryParameters: mapStringArrayToNestedForm(cachePolicy.divergenceQueryParameters),
      enableStaleWhileError: cachePolicy.enableStaleWhileError,
      staleWhileErrorTime: cachePolicy.staleWhileErrorTime,
      enableStaleWhileRevalidate: cachePolicy.enableStaleWhileRevalidate,
      staleWhileRevalidateTime: cachePolicy.staleWhileRevalidateTime,
    },
    endpoint: {
      path: `/v1/domain-groups/${domainGroupId}/cache-policies/${cachePolicyId}`,
      method: 'PATCH',
      body: { $type: 'jsonata', value: FRONTIER_CACHE_POLICY_BODY },
    },
    postEndpointActions: [{
      $type: 'redirect',
      url: {
        $type: 'jsonata',
        value: `service.localPath & '/domain-group/${domainGroupId}/cache-policy/${cachePolicyId}'`,
      },
    }],
    buttons: { submitButtonText: 'Cache Policy aktualisieren' },
  };
}

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
  }, {
    id: 'corsPolicyId',
    $type: 'select',
    label: 'CORS Policy (optional)',
    enableSearch: true,
    data: {
      $type: 'datasource',
      value: 'corsPolicies',
    },
  }, {
    id: 'logPolicyId',
    $type: 'select',
    label: 'Log Policy (optional)',
    enableSearch: true,
    data: {
      $type: 'datasource',
      value: 'logPolicies',
    },
  }],
  initialValues: {
    $type: 'jsonata',
    value: `{
      "name": "",
      "path": "/*",
      "order": 0,
      "cachePolicyId": dataSource.cachePolicies[0] ? dataSource.cachePolicies[0].value : "",
      "upstreamGroupId": dataSource.upstreamGroups[0] ? dataSource.upstreamGroups[0].value : "",
      "corsPolicyId": "",
      "logPolicyId": ""
    }`,
  },
  endpoint: {
    path: `/v1/domain-groups/${domainGroupId}/path-rules`,
    method: 'POST',
    body: { $type: 'jsonata', value: FRONTIER_PATH_RULE_BODY },
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
    corsPolicies: {
      $type: 'fetch',
      path: `/v1/domain-groups/${domainGroupId}/cors-policies`,
      method: 'GET',
      transformResponse: {
        $type: 'jsonata',
        value: '{ "body": [{"id": "", "value": "", "label": "(keine)"}, body.{ "id": id, "value": id, "label": name }] }',
      },
    },
    logPolicies: {
      $type: 'fetch',
      path: `/v1/domain-groups/${domainGroupId}/log-policies`,
      method: 'GET',
      transformResponse: {
        $type: 'jsonata',
        value: '{ "body": [{"id": "", "value": "", "label": "(keine)"}, body.{ "id": id, "value": id, "label": name }] }',
      },
    },
  },
  buttons: { submitButtonText: 'Path Rule erstellen' },
});

export function FRONTIER_PATH_RULE_UPDATE_FORM(
  domainGroupId: string,
  pathRuleId: string,
  pathRule: PathRuleDto,
): TGeneratedFormDefinition {
  return {
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
    }, {
      id: 'corsPolicyId',
      $type: 'select',
      label: 'CORS Policy (optional)',
      enableSearch: true,
      data: {
        $type: 'datasource',
        value: 'corsPolicies',
      },
    }, {
      id: 'logPolicyId',
      $type: 'select',
      label: 'Log Policy (optional)',
      enableSearch: true,
      data: {
        $type: 'datasource',
        value: 'logPolicies',
      },
    }],
    initialValues: {
      name: pathRule.name,
      path: pathRule.path,
      order: pathRule.order,
      cachePolicyId: pathRule.cachePolicyId,
      upstreamGroupId: pathRule.upstreamGroupId,
      corsPolicyId: pathRule.corsPolicyId ?? '',
      logPolicyId: pathRule.logPolicyId ?? '',
    },
    endpoint: {
      path: `/v1/domain-groups/${domainGroupId}/path-rules/${pathRuleId}`,
      method: 'PATCH',
      body: { $type: 'jsonata', value: FRONTIER_PATH_RULE_BODY },
    },
    postEndpointActions: [{
      $type: 'redirect',
      url: {
        $type: 'jsonata',
        value: `service.localPath & '/domain-group/${domainGroupId}/path-rule/${pathRuleId}'`,
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
      corsPolicies: {
        $type: 'fetch',
        path: `/v1/domain-groups/${domainGroupId}/cors-policies`,
        method: 'GET',
        transformResponse: {
          $type: 'jsonata',
          value: '{ "body": [{"id": "", "value": "", "label": "(keine)"}, body.{ "id": id, "value": id, "label": name }] }',
        },
      },
      logPolicies: {
        $type: 'fetch',
        path: `/v1/domain-groups/${domainGroupId}/log-policies`,
        method: 'GET',
        transformResponse: {
          $type: 'jsonata',
          value: '{ "body": [{"id": "", "value": "", "label": "(keine)"}, body.{ "id": id, "value": id, "label": name }] }',
        },
      },
    },
    buttons: { submitButtonText: 'Path Rule aktualisieren' },
  };
}

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

const FRONTIER_CORS_POLICY_INPUTS: TGeneratedFormDefinition['inputs'] = [{
  id: 'name',
  $type: 'text',
  label: 'Name',
}, {
  id: 'enabled',
  $type: 'checkbox',
  label: 'CORS aktivieren',
}, {
  id: 'allowCredentials',
  $type: 'checkbox',
  label: 'Credentials erlauben',
}, createStringArrayInput('allowedOrigins', 'Erlaubte Origins', 'Origin')];

const FRONTIER_CORS_POLICY_BODY = `{
  "name": form.name,
  "enabled": form.enabled,
  "allowCredentials": form.allowCredentials,
  "allowedOrigins": $reduce(form.allowedOrigins, function($acc, $item) { $append($acc, $item.value) }, [])
}`;

export const FRONTIER_CORS_POLICY_CREATE_FORM = (domainGroupId: string): TGeneratedFormDefinition => ({
  inputs: FRONTIER_CORS_POLICY_INPUTS,
  initialValues: {
    name: '',
    enabled: true,
    allowCredentials: false,
    allowedOrigins: [],
  },
  endpoint: {
    path: `/v1/domain-groups/${domainGroupId}/cors-policies`,
    method: 'POST',
    body: { $type: 'jsonata', value: FRONTIER_CORS_POLICY_BODY },
  },
  postEndpointActions: [{
    $type: 'redirect',
    url: {
      $type: 'jsonata',
      value: `service.localPath & '/domain-group/${domainGroupId}/cors-policy/' & response.body.id`,
    },
  }],
  buttons: { submitButtonText: 'CORS Policy erstellen' },
});

export function FRONTIER_CORS_POLICY_UPDATE_FORM(
  domainGroupId: string,
  corsPolicyId: string,
  corsPolicy: CorsPolicyDto,
): TGeneratedFormDefinition {
  return {
    inputs: FRONTIER_CORS_POLICY_INPUTS,
    initialValues: {
      name: corsPolicy.name,
      enabled: corsPolicy.enabled ?? true,
      allowCredentials: corsPolicy.allowCredentials ?? false,
      allowedOrigins: mapStringArrayToNestedForm(corsPolicy.allowedOrigins ?? []),
    },
    endpoint: {
      path: `/v1/domain-groups/${domainGroupId}/cors-policies/${corsPolicyId}`,
      method: 'PATCH',
      body: { $type: 'jsonata', value: FRONTIER_CORS_POLICY_BODY },
    },
    postEndpointActions: [{
      $type: 'redirect',
      url: {
        $type: 'jsonata',
        value: `service.localPath & '/domain-group/${domainGroupId}/cors-policy/${corsPolicyId}'`,
      },
    }],
    buttons: { submitButtonText: 'CORS Policy aktualisieren' },
  };
}

const FRONTIER_LOG_POLICY_INPUTS: TGeneratedFormDefinition['inputs'] = [{
  id: 'name',
  $type: 'text',
  label: 'Name',
}, {
  id: 'enabled',
  $type: 'checkbox',
  label: 'Logging aktivieren',
}, {
  id: 'retentionTimeSeconds',
  $type: 'number',
  label: 'Retention (Sekunden)',
}];

const FRONTIER_LOG_POLICY_BODY = `{
  "name": form.name,
  "enabled": form.enabled,
  "retentionTimeSeconds": form.retentionTimeSeconds
}`;

export const FRONTIER_LOG_POLICY_CREATE_FORM = (domainGroupId: string): TGeneratedFormDefinition => ({
  inputs: FRONTIER_LOG_POLICY_INPUTS,
  initialValues: {
    name: '',
    enabled: true,
    retentionTimeSeconds: 604800,
  },
  endpoint: {
    path: `/v1/domain-groups/${domainGroupId}/log-policies`,
    method: 'POST',
    body: { $type: 'jsonata', value: FRONTIER_LOG_POLICY_BODY },
  },
  postEndpointActions: [{
    $type: 'redirect',
    url: {
      $type: 'jsonata',
      value: `service.localPath & '/domain-group/${domainGroupId}/log-policy/' & response.body.id`,
    },
  }],
  buttons: { submitButtonText: 'Log Policy erstellen' },
});

export function FRONTIER_LOG_POLICY_UPDATE_FORM(
  domainGroupId: string,
  logPolicyId: string,
  logPolicy: LogPolicyDto,
): TGeneratedFormDefinition {
  return {
    inputs: FRONTIER_LOG_POLICY_INPUTS,
    initialValues: {
      name: logPolicy.name,
      enabled: logPolicy.enabled ?? true,
      retentionTimeSeconds: logPolicy.retentionTimeSeconds ?? 604800,
    },
    endpoint: {
      path: `/v1/domain-groups/${domainGroupId}/log-policies/${logPolicyId}`,
      method: 'PATCH',
      body: { $type: 'jsonata', value: FRONTIER_LOG_POLICY_BODY },
    },
    postEndpointActions: [{
      $type: 'redirect',
      url: {
        $type: 'jsonata',
        value: `service.localPath & '/domain-group/${domainGroupId}/log-policy/${logPolicyId}'`,
      },
    }],
    buttons: { submitButtonText: 'Log Policy aktualisieren' },
  };
}

