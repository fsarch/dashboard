import { TGeneratedFormDefinition } from '@/components/universals/forms/generated/GeneratedForm.type';

export const AGGREGATION_MODE_TYPE_CREATE_FORM: TGeneratedFormDefinition = {
  inputs: [
    {
      id: 'name',
      $type: 'text',
      label: 'Name',
    },
    {
      id: 'externalId',
      $type: 'text',
      label: 'External ID',
    },
  ],
  initialValues: {
    $type: 'jsonata',
    value: '{ "name": "", "externalId": null }',
  },
  endpoint: {
    path: '/v1/aggregation-mode-types',
    method: 'POST',
    body: {
      $type: 'jsonata',
      value: '{ "name": form.name, "externalId": form.externalId }',
    },
  },
  postEndpointActions: [
    {
      $type: 'redirect',
      url: {
        $type: 'jsonata',
        value: '`/credence/${serviceId}/aggregation-mode-type`',
      },
    },
  ],
};
