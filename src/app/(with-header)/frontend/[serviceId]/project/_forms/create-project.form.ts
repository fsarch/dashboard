import { TGeneratedFormDefinition } from '@/components/universals/forms/generated/GeneratedForm.type';

export const CREATE_PROJECT_FORM: TGeneratedFormDefinition = {
  inputs: [
    {
      id: 'name',
      $type: 'text',
      label: 'Projektname'
    },
  ],
  initialValues: {
    $type: 'jsonata',
    value: '{ "name": "" }'
  },
  endpoint: {
    path: '/v1/projects',
    method: 'POST',
    body: {
      $type: 'jsonata',
      value: '{ "name": form.name }'
    },
  },
  postEndpointActions: [{
    $type: 'redirect',
    url: {
      $type: 'jsonata',
      value: "service.localPath & '/project/' & response.body.id"
    }
  }],
};
