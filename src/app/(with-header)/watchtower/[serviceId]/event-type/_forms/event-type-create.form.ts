import { TGeneratedFormDefinition } from '@/components/universals/forms/generated/GeneratedForm.type';

export const EVENT_TYPE_CREATE_FORM: TGeneratedFormDefinition = {
  inputs: [
    {
      id: 'name',
      $type: 'text',
      label: 'Name',
    },
    {
      id: 'defaultScoreFactor',
      $type: 'text',
      label: 'Score Factor',
    },
    {
      id: 'defaultTtlSeconds',
      $type: 'number',
      label: 'TTL (Sekunden)',
    },
    {
      id: 'aggregationModeId',
      $type: 'select',
      label: 'Aggregation Mode',
      data: {
        $type: 'datasource',
        value: 'aggregationModes',
      },
      enableSearch: true,
    },
  ],
  dataSources: {
    aggregationModes: {
      $type: 'fetch',
      path: '/v1/aggregation-modes?page=1&pageSize=100',
      method: 'GET',
      transformResponse: {
        $type: 'jsonata',
        value: '{ "body": [body.data.{ "id": id, "value": id, "label": name }] }',
      },
    },
  },
  initialValues: {
    $type: 'jsonata',
    value: '{ "name": "", "defaultScoreFactor": "", "defaultTtlSeconds": 3600, "aggregationModeId": dataSource.aggregationModes[0].id }',
  },
  endpoint: {
    path: '/v1/event-types',
    method: 'POST',
    body: {
      $type: 'jsonata',
      value: '{ "name": form.name, "defaultScoreFactor": form.defaultScoreFactor, "defaultTtlSeconds": form.defaultTtlSeconds, "aggregationModeId": form.aggregationModeId }',
    },
  },
  postEndpointActions: [
    {
      $type: 'redirect',
      url: {
        $type: 'jsonata',
        value: '`/watchtower/${serviceId}/event-type`',
      },
    },
  ],
};
