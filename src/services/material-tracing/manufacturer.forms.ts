import { TGeneratedFormDefinition } from "@/components/universals/forms/generated/GeneratedForm.type";

export const MANUFACTURER_CREATE_FORM: TGeneratedFormDefinition = {
  inputs: [{
    id: 'name',
    type: 'text',
    label: 'Name',
  }],
  initialValues: {
    name: '',
  },
  endpoint: {
    path: '/v1/manufacturers',
    method: 'POST',
    body: {
      $type: 'jsonata',
      value: 'form',
    },
  },
  dataSources: {},
};
