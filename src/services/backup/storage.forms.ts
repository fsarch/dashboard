import { TGeneratedFormDefinition } from '@/components/universals/forms/generated/GeneratedForm.type';

export const STORAGE_CREATE_FORM: TGeneratedFormDefinition = {
  inputs: [{
    id: 'name',
    $type: 'text',
    label: 'Name',
  }, {
    id: "storageTypeId",
    $type: "select",
    label: "Storage Type",
    data: {
      $type: "constant",
      value: [
        {
          id: "04964d16-ac26-4719-8bb4-540844f34aeb",
          value: "04964d16-ac26-4719-8bb4-540844f34aeb",
          label: "Local Storage",
        },
      ]
    },
  }, {
    id: 'path',
    $type: 'text',
    label: 'Path',
  }],
  initialValues: {
    $type: 'jsonata',
    value: '{ "name": "", "storageTypeId": "04964d16-ac26-4719-8bb4-540844f34aeb", "path": "" }',
  },
  endpoint: {
    path: '/v1/storages',
    method: 'POST',
    body: { $type: 'jsonata', value: 'form' },
  },
  postEndpointActions: [{
    $type: 'redirect',
    url: { $type: 'jsonata', value: "service.localPath & '/storage/' & response.body.id" },
  }],
  buttons: { submitButtonText: 'Create Storage' },
};

