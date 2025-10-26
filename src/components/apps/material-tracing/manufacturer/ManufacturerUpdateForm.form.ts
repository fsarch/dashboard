import { TGeneratedFormDefinition } from "@/components/universals/forms/generated/GeneratedForm.type";

export const MANUFACTURER_UPDATE_FORM_DEFINITION: TGeneratedFormDefinition = {
  inputs: [{
    id: 'name',
    $type: 'text',
    label: 'Name',
  }, {
    id: 'hint',
    $type: 'text',
    label: 'Hinweis',
  }, {
    id: 'externalId',
    $type: 'text',
    label: 'External Id',
  }],
  initialValues: {
    $type: 'jsonata',
    value: '{ "name": args.manufacturer.name, "hint": args.manufacturer.hint, "externalId": args.manufacturer.externalId }'
  },
  endpoint: {
    path: {
      $type: 'jsonata',
      value: "'/v1/manufacturers/' & args.manufacturer.id"
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
