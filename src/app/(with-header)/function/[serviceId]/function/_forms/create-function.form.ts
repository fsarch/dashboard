import { TGeneratedFormDefinition } from "@/components/universals/forms/generated/GeneratedForm.type";

export const FUNCTION_CREATE_FORM: TGeneratedFormDefinition = {
  inputs: [{
    id: 'name',
    type: 'text',
    label: 'Name',
  }],
  initialValues: {
    $type: 'jsonata',
    value: '{ "name": "" }'
  },
  endpoint: {
    path: '/v1/functions',
    method: 'POST',
    body: {
      $type: 'jsonata',
      value: 'form',
    },
  },
};
