import { TGeneratedFormDefinition } from "@/components/universals/forms/generated/GeneratedForm.type";

export const FUNCTION_GATEWAY_CREATE_FORM: TGeneratedFormDefinition = {
  inputs: [{
    id: 'name',
    $type: 'text',
    label: 'Name',
  }, {
    id: 'functionId',
    $type: 'text',
    label: 'Funktions-ID',
  }],
  initialValues: {
    $type: 'jsonata',
    value: '{ "name": "", "functionId": "" }'
  },
  endpoint: {
    path: '/functions',
    method: 'POST',
    body: {
      $type: 'jsonata',
      value: 'form',
    },
  },
};
