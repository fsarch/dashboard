import { TGeneratedFormDefinition } from '@/components/universals/forms/generated/GeneratedForm.type';

export const IP_ASN_DATA_CREATE_FORM = (datasourceId: string): TGeneratedFormDefinition => ({
  inputs: [
    {
      id: 'prefix',
      $type: 'text',
      label: 'Prefix',
    },
    {
      id: 'asn',
      $type: 'number',
      label: 'ASN',
    },
    {
      id: 'asnOrganization',
      $type: 'text',
      label: 'ASN Organisation',
    },
    {
      id: 'externalId',
      $type: 'text',
      label: 'Externe ID (optional)',
    },
  ],
  initialValues: {
    $type: 'jsonata',
    value: '{ "prefix": "", "asn": 0, "asnOrganization": "", "externalId": "" }',
  },
  endpoint: {
    path: `/v1/ip-asn/datasources/${datasourceId}/data`,
    method: 'POST',
    body: {
      $type: 'jsonata',
      value: '{ "prefix": form.prefix, "asn": form.asn, "asnOrganization": form.asnOrganization, "externalId": form.externalId != "" ? form.externalId : null }',
    },
  },
});
