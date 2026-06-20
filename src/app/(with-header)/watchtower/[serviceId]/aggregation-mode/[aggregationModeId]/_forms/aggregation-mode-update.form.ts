import { TGeneratedFormDefinition } from '@/components/universals/forms/generated/GeneratedForm.type';

export const AGGREGATION_MODE_UPDATE_FORM: TGeneratedFormDefinition = {
  inputs: [
    {
      id: 'name',
      $type: 'text',
      label: 'Name',
    },
    {
      id: 'aggregationModeTypeId',
      $type: 'select',
      label: 'Aggregation Mode Type',
      data: {
        $type: 'datasource',
        value: 'aggregationModeTypes',
      },
      enableSearch: true,
    },
    {
      id: 'maxFactor',
      $type: 'text',
      label: 'Max Factor',
    },
    {
      id: 'externalId',
      $type: 'text',
      label: 'External ID',
    },
  ],
  dataSources: {
    aggregationModeTypes: {
      $type: 'fetch',
      path: '/v1/aggregation-mode-types?page=1&pageSize=100',
      method: 'GET',
      transformResponse: {
        $type: 'jsonata',
        value: '{ "body": body.data.{ "id": id, "value": id + "", "label": name } }',
      },
    },
    aggregationMode: {
      $type: 'fetch',
      path: '/v1/aggregation-modes/',
      method: 'GET',
      transformResponse: {
        $type: 'jsonata',
        value: '{ "body": { "name": data.name, "aggregationModeTypeId": data.aggregationModeTypeId, "maxFactor": data.maxFactor, "externalId": data.externalId } }',
      },
    },
  },
  initialValues: {
    $type: 'datasource',
    value: 'aggregationMode',
  },
  endpoint: {
    path: '/v1/aggregation-modes/',
    method: 'PATCH',
    body: {
      $type: 'jsonata',
      value: '{ "name": form.name, "aggregationModeTypeId": form.aggregationModeTypeId, "maxFactor": form.maxFactor, "externalId": form.externalId }',
    },
  },
  postEndpointActions: [
    {
      $type: 'redirect',
      url: {
        $type: 'jsonata',
        value: '`/watchtower/${serviceId}/aggregation-mode`',
      },
    },
  ],
};
