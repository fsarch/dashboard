import { TGeneratedFormDefinition } from "@/components/universals/forms/generated/GeneratedForm.type";

export const SHORT_CODE_UPDATE_FORM_DEFINITION: TGeneratedFormDefinition = {
  inputs: [{
    id: 'hint',
    type: 'text',
    label: 'Hint',
  }],
  initialValues: {
    $type: 'jsonata',
    value: '{ "hint": args.shortCode.hint }'
  },
  endpoint: {
    path: {
      $type: 'jsonata',
      value: "'/v1/short-codes/' & args.shortCode.code"
    },
    method: 'PATCH',
    body: {
      $type: 'jsonata',
      value: '{ "hint": form.hint }',
    },
  },
  buttons: {
    submitButtonText: 'Aktualisieren',
  },
};