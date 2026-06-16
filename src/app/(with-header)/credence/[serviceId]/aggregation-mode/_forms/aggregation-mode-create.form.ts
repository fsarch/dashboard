import { TGeneratedFormDefinition } from '@/components/universals/forms/generated/GeneratedForm.type';

export const AGGREGATION_MODE_CREATE_FORM: TGeneratedFormDefinition = {
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
        value: '{ "body": data.data.{ "id": id, "value": id + "", "label": name } }',
      },
    },
  },
  initialValues: {
    $type: 'jsonata',
    value: '{ "name": "", "aggregationModeTypeId": "", "maxFactor": null, "externalId": null }',
  },
  endpoint: {
    path: '/v1/aggregation-modes',
    method: 'POST',
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
        value: '`/credence/${serviceId}/aggregation-mode`',
      },
    },
  ],
};
