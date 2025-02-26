import { TGeneratedFormDefinition } from "@/components/universals/forms/generated/GeneratedForm.type";

export const SHORT_CODE_CREATE_FORM: TGeneratedFormDefinition = {
  inputs: [],
  initialValues: {},
  endpoint: {
    path: '/v1/short-codes',
    method: 'POST',
    body: {
      $type: 'jsonata',
      value: 'form',
    },
  },
};
