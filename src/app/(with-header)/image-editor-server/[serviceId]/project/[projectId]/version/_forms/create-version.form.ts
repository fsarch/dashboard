import { TGeneratedFormDefinition } from '@/components/universals/forms/generated/GeneratedForm.type';

export const CREATE_VERSION_FORM: TGeneratedFormDefinition = {
  inputs: [
    { id: 'width', $type: 'number', label: 'Breite (px)' },
    { id: 'height', $type: 'number', label: 'Höhe (px)' },
    { id: 'externalId', $type: 'text', label: 'External Id' },
  ],
  initialValues: {
    $type: 'jsonata',
    value: '{ "width": 1000, "height": 1000, "externalId": "" }',
  },
  endpoint: {
    path: {
      $type: 'jsonata',
      value: "'/v1/projects/' & args.projectId & '/versions'",
    },
    method: 'POST',
    body: {
      $type: 'jsonata',
      value: '{ "width": $number(form.width), "height": $number(form.height), "externalId": form.externalId != \'\' ? form.externalId }',
    },
  },
  postEndpointActions: [{
    $type: 'redirect',
    url: {
      $type: 'jsonata',
      value: "service.localPath & '/project/' & args.projectId & '/version/' & response.body.id",
    },
  }],
};
