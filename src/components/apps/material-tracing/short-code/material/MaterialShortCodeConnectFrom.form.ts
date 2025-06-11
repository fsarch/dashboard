import { TGeneratedFormDefinition } from "@/components/universals/forms/generated/GeneratedForm.type";

export const MATERIAL_SHORT_CODE_CONNECT_FORM: TGeneratedFormDefinition = {
  inputs: [{
    id: 'shortCode',
    type: 'text',
    label: 'ShortCode',
    buttons: [{
      type: 'qr-scanner',
    }],
  }],
  initialValues: {
    shortCode: '',
  },
  endpoint: {
    path: {
      $type: 'jsonata',
      value: "'/v1/materials/' & args.materialId & '/short-codes/' & form.shortCode"
    },
    method: 'PUT',
    body: {
      $type: 'jsonata',
      value: 'form',
    },
  },
  dataSources: {},
};
