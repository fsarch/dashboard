import { TGeneratedFormDefinition } from "@/components/universals/forms/generated/GeneratedForm.type";

export const PART_UPDATE_FORM_DEFINITION: TGeneratedFormDefinition = {
  inputs: [{
    id: 'name',
    type: 'text',
    label: 'Name',
  }, {
    id: 'amount',
    type: 'text',
    label: 'Anzahl',
  }, {
    id: 'availableAmount',
    type: 'text',
    label: 'Verfügbare Anzahl',
    isEnabled: false,
  }, {
    id: 'externalId',
    type: 'text',
    label: 'External Id',
  }],
  initialValues: {
    $type: 'jsonata',
    value: "args.part"
  },
  endpoint: {
    path: {
      $type: 'jsonata',
      value: "'/v1/parts/' & args.part.id"
    },
    method: 'PATCH',
    body: {
      $type: 'jsonata',
      value: '{ "name": form.name, "partTypeId": form.partTypeId, "amount": $number(form.amount) }',
    },
  },
  dataSources: {},
};
