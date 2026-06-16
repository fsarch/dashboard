import { TGeneratedFormDefinition } from '@/components/universals/forms/generated/GeneratedForm.type';

export const SCOPE_TYPE_CREATE_FORM: TGeneratedFormDefinition = {
  inputs: [
    {
      id: 'scopeDataTypeId',
      $type: 'select',
      label: 'Scope Data Type',
      data: {
        $type: 'datasource',
        value: 'scopeDataTypes',
      },
    },
    {
      id: 'name',
      $type: 'text',
      label: 'Name',
    },
    {
      id: 'key',
      $type: 'text',
      label: 'Key',
    },
    {
      id: 'scoreFactor',
      $type: 'text',
      label: 'Score Factor',
    },
    {
      id: 'externalId',
      $type: 'text',
      label: 'Externe ID (optional)',
    },
  ],
  initialValues: {
    $type: 'jsonata',
    value: '{ "scopeDataTypeId": "", "name": "", "key": "", "scoreFactor": "", "externalId": "" }',
  },
  endpoint: {
    path: '/v1/scope-types',
    method: 'POST',
    body: {
      $type: 'jsonata',
      value: '{ "scopeDataTypeId": form.scopeDataTypeId, "name": form.name, "key": form.key, "scoreFactor": form.scoreFactor, "externalId": form.externalId != "" ? form.externalId : null }',
    },
  },
  dataSources: {
    scopeDataTypes: {
      $type: 'fetch',
      path: '/v1/scope-data-types?page=1&pageSize=100',
      method: 'GET',
      transformResponse: {
        $type: 'jsonata',
        value: '{ "body": data.{"id": id, "value": id + "", "label": name} }',
      },
    },
  },
};
