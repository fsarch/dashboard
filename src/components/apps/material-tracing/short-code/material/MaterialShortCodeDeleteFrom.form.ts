import { TGeneratedFormDefinition } from "@/components/universals/forms/generated/GeneratedForm.type";

export const MATERIAL_SHORT_CODE_DELETE_FORM: TGeneratedFormDefinition = {
  inputs: [],
  initialValues: {},
  endpoint: {
    path: {
      $type: 'jsonata',
      value: "'/v1/materials/' & args.materialId & '/short-codes/' & args.shortCode"
    },
    method: 'DELETE',
    body: {
      $type: 'jsonata',
      value: 'form',
    },
  },
  dataSources: {},
};
