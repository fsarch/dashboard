import { TGeneratedFormDefinition } from '@/components/universals/forms/generated/GeneratedForm.type';

export const IP_ASN_DATASOURCE_CREATE_FORM: TGeneratedFormDefinition = {
  inputs: [
    {
      id: 'name',
      $type: 'text',
      label: 'Name',
    },
    {
      id: 'externalId',
      $type: 'text',
      label: 'Externe ID (optional)',
    },
  ],
  initialValues: {
    $type: 'jsonata',
    value: '{ "name": "", "externalId": "" }',
  },
  endpoint: {
    path: '/v1/ip-asn/datasources',
    method: 'POST',
    body: {
      $type: 'jsonata',
      value: '{ "name": form.name, "externalId": form.externalId != "" ? form.externalId : null }',
    },
  },
};
