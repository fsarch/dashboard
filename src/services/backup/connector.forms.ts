import { TGeneratedFormDefinition } from '@/components/universals/forms/generated/GeneratedForm.type';

export const CONNECTOR_CREATE_FORM: TGeneratedFormDefinition = {
  inputs: [{
    id: 'name',
    $type: 'text',
    label: 'Name',
  }, {
    id: 'url',
    $type: 'text',
    label: 'URL',
  }, {
    id: 'secret',
    $type: 'text',
    label: 'Secret',
  }],
  initialValues: { $type: 'jsonata', value: '{ "name": "" }' },
  endpoint: {
    path: '/v1/connectors',
    method: 'POST',
    body: { $type: 'jsonata', value: 'form' },
  },
  postEndpointActions: [{
    $type: 'redirect',
    url: { $type: 'jsonata', value: "service.localPath & '/connector/' & response.body.id" },
  }],
  buttons: { submitButtonText: 'Create Connector' },
};

