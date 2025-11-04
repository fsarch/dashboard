import { TGeneratedFormDefinition } from "@/components/universals/forms/generated/GeneratedForm.type";

export const PART_TYPE_CREATE_FORM: TGeneratedFormDefinition = {
  inputs: [{
    id: 'name',
    $type: 'text',
    label: 'Name',
  }, {
    id: 'externalId',
    $type: 'text',
    label: 'ExternalId',
  }],
  initialValues: {
    $type: 'jsonata',
    value: '{ "name": "", "externalId": "" }'
  },
  endpoint: {
    path: '/v1/part-types',
    method: 'POST',
    body: {
      $type: 'jsonata',
      value: '{ "name": form.name, "externalId": form.externalId != "" ? form.externalId : null }',
    },
  },
};
