import { TGeneratedFormDefinition } from "@/components/universals/forms/generated/GeneratedForm.type";

export const MATERIAL_UPDATE_FORM_DEFINITION: TGeneratedFormDefinition = {
  inputs: [{
    id: 'name',
    type: 'text',
    label: 'Name',
  }, {
    id: 'hint',
    type: 'text',
    label: 'Hinweis',
  }, {
    id: 'externalId',
    type: 'text',
    label: 'External Id',
  }],
  initialValues: {
    $type: 'jsonata',
    value: '{ "name": args.material.name, "hint": args.material.hint, "externalId": args.material.externalId }'
  },
  endpoint: {
    path: {
      $type: 'jsonata',
      value: "'/v1/materials/' & args.material.id"
    },
    method: 'PATCH',
    body: {
      $type: 'jsonata',
      value: '{ "name": form.name, "hint": form.hint, "externalId": form.externalId }',
    },
  },
  buttons: {
    submitButtonText: 'Aktualisieren',
  },
};
