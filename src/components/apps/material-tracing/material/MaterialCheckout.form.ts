import { TGeneratedFormDefinition } from "@/components/universals/forms/generated/GeneratedForm.type";

export const MATERIAL_CHECKOUT_FORM: TGeneratedFormDefinition = {
  inputs: [],
  initialValues: {
    $type: 'jsonata',
    value: '{}',
  },
  endpoint: {
    path: {
      $type: 'jsonata',
      value: "'/v1/materials/' & args.materialId & '/_actions/checkout'",
    },
    method: 'POST',
    body: {
      $type: 'jsonata',
      value: 'form',
    },
  },
  buttons: {
    submitButtonText: 'Material ausbuchen',
  },
};
