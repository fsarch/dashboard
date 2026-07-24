import {
  TGeneratedFormDefinition,
} from '@/components/universals/forms/generated/GeneratedForm.type';

export const IMAGE_TAG_DEFINITION_CREATE_FORM: TGeneratedFormDefinition = {
  inputs: [
    {
      id: 'key',
      $type: 'text',
      label: 'Key',
    },
    {
      id: 'description',
      $type: 'textarea',
      label: 'Description (optional)',
    },
  ],
  initialValues: {
    $type: 'jsonata',
    value: '{ "key": "", "description": "" }',
  },
  endpoint: {
    path: '/v1/admin/images/tags/definitions',
    method: 'POST',
    body: {
      $type: 'jsonata',
      value: '{ "key": form.key, "description": form.description }',
    },
  },
  postEndpointActions: [
    {
      $type: 'redirect',
      url: {
        $type: 'jsonata',
        value: "service.localPath & '/tags'",
      },
    },
  ],
  buttons: { submitButtonText: 'Tag-Definition erstellen' },
};

export const IMAGE_TAG_CREATE_FORM = (imageId: string): TGeneratedFormDefinition => ({
  inputs: [
    {
      id: 'key',
      $type: 'select',
      label: 'Tag Definition',
      enableSearch: true,
      data: { $type: 'datasource', value: 'tagDefinitions' },
    },
    {
      id: 'value',
      $type: 'text',
      label: 'Value',
    },
  ],
  initialValues: {
    $type: 'jsonata',
    value: '{ "key": dataSource.tagDefinitions[0] ? dataSource.tagDefinitions[0].value : "", "value": "" }',
  },
  dataSources: {
    tagDefinitions: {
      $type: 'fetch',
      path: '/v1/admin/images/tags/definitions',
      method: 'GET',
      transformResponse: {
        $type: 'jsonata',
        value:
          '{ "body": [body.{ "id": key, "value": key, "label": key & (description ? " - " & description : "") }] }',
      },
    },
  },
  endpoint: {
    path: `/v1/admin/images/${imageId}/tags`,
    method: 'POST',
    body: {
      $type: 'jsonata',
      value: '{ "key": form.key, "value": form.value }',
    },
  },
  postEndpointActions: [
    {
      $type: 'redirect',
      url: {
        $type: 'jsonata',
        value: `service.localPath & '/images/' & args.imageId & '/tags'`,
      },
    },
  ],
  buttons: { submitButtonText: 'Tag hinzufügen' },
});
