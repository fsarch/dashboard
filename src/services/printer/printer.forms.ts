import { TGeneratedFormDefinition } from "@/components/universals/forms/generated/GeneratedForm.type";

export const PRINTER_CREATE_FORM: TGeneratedFormDefinition = {
  inputs: [{
    id: 'printerTypeId',
    type: 'select',
    label: 'Printer Type',
    data: {
      $type: 'constant',
      value: [{
        id: '58d0f051-13b2-4545-b4ff-fe661fe20d04',
        value: '58d0f051-13b2-4545-b4ff-fe661fe20d04',
        label: 'Receipt'
      }]
    },
  }, {
    id: 'name',
    type: 'text',
    label: 'Name',
  }, {
    id: 'externalId',
    type: 'text',
    label: 'External ID (Optional)',
  }],
  initialValues: {
    $type: 'jsonata',
    value: '{ "printerTypeId": "58d0f051-13b2-4545-b4ff-fe661fe20d04", "name": "", "externalId": "" }'
  },
  endpoint: {
    path: '/v1/printers',
    method: 'POST',
    body: {
      $type: 'jsonata',
      value: 'form',
    },
  },
  postEndpointActions: [{
    $type: 'redirect',
    url: {
      $type: 'jsonata',
      value: "service.localPath & '/printer/' & response.body.id",
    },
  }],
  buttons: {
    submitButtonText: 'Create Printer',
  },
};