import { TGeneratedFormDefinition } from '@/components/universals/forms/generated/GeneratedForm.type';

export const CREATE_PROJECT_FORM: TGeneratedFormDefinition = {
  inputs: [
    { id: 'name', $type: 'text', label: 'Projektname' },
    { id: 'description', $type: 'textarea', label: 'Beschreibung' },
    { id: 'externalId', $type: 'text', label: 'External Id' },
  ],
  initialValues: {
    $type: 'jsonata',
    value: '{ "name": "", "description": "", "externalId": "" }',
  },
  endpoint: {
    path: '/v1/projects',
    method: 'POST',
    body: {
      $type: 'jsonata',
      value: '{ "name": form.name, "description": form.description != \'\' ? form.description, "externalId": form.externalId != \'\' ? form.externalId }',
    },
  },
  postEndpointActions: [{
    $type: 'redirect',
    url: {
      $type: 'jsonata',
      value: "service.localPath & '/project/' & response.body.id",
    },
  }],
};
