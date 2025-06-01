import { TGeneratedFormDefinition } from "@/components/universals/forms/generated/GeneratedForm.type";

export const PART_TYPE_UPDATE_FORM: TGeneratedFormDefinition = {
  inputs: [{
    id: 'name',
    type: 'text',
    label: 'Name',
  }, {
    id: 'externalId',
    type: 'text',
    label: 'ExternalId',
  }],
  initialValues: {
    $type: 'jsonata',
    value: '{ "name": args.partType.name, "externalId": args.partType.externalId }'
  },
  endpoint: {
    path: {
      $type: 'jsonata',
      value: "'/v1/part-types/' & args.partType.id"
    },
    method: 'PATCH',
    body: {
      $type: 'jsonata',
      value: 'form',
    },
  },
  buttons: {
    submitButtonText: 'Aktualisieren',
  },
};
