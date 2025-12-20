import { TGeneratedFormDefinition } from "@/components/universals/forms/generated/GeneratedForm.type";

export const PART_UPDATE_FORM_DEFINITION: TGeneratedFormDefinition = {
  inputs: [{
    id: 'name',
    $type: 'text',
    label: 'Name',
  }, {
    id: 'amount',
    $type: 'text',
    label: 'Anzahl',
  }, {
    id: 'availableAmount',
    $type: 'text',
    label: 'Verfügbare Anzahl',
    isEnabled: false,
  }, {
    id: 'externalId',
    $type: 'text',
    label: 'External Id',
  }, {
    id: 'hint',
    $type: 'text',
    label: 'Hinweis',
  }, {
    id: 'archiveNow',
    $type: 'checkbox',
    label: 'Archiviert',
  }],
  initialValues: {
    $type: 'jsonata',
    value: `{ 
      "name": args.part.name,
      "amount": args.part.amount,
      "availableAmount": args.part.availableAmount,
      "externalId": args.part.externalId,
      "hint": args.part.hint,
      "archiveTime": args.part.archiveTime,
      "archiveNow": $not($exists(args.part.archiveTime)) or args.part.archiveTime = null 
        ? false 
        : true
    }`,
  },
  endpoint: {
    path: {
      $type: 'jsonata',
      value: "'/v1/parts/' & args.part.id"
    },
    method: 'PATCH',
    body: {
      $type: 'jsonata',
      value: `{ "name": form.name, "amount": $number(form.amount), "externalId": form.externalId, "hint": form.hint, "checkoutTime": form.checkoutTime, "archiveTime": form.archiveTime and form.archiveNow ? form.archiveTime : (form.archiveNow ? $now() : null) }`,
    },
  },
  dataSources: {},
  buttons: {
    submitButtonText: 'Aktualisieren',
  },
};
