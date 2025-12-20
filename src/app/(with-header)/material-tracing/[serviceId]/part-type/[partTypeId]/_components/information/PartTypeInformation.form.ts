import { TGeneratedFormDefinition } from "@/components/universals/forms/generated/GeneratedForm.type";

export const PART_TYPE_UPDATE_FORM: TGeneratedFormDefinition = {
  inputs: [{
    id: 'name',
    $type: 'text',
    label: 'Name',
  }, {
    id: 'externalId',
    $type: 'text',
    label: 'ExternalId',
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
    value: `{ "name": args.partType.name, "externalId": args.partType.externalId, "hint": args.partType.hint, "archiveTime": args.partType.archiveTime, "archiveNow": $not($exists(args.partType.archiveTime)) or args.partType.archiveTime = null ? false : true }`
  },
  endpoint: {
    path: {
      $type: 'jsonata',
      value: "'/v1/part-types/' & args.partType.id"
    },
    method: 'PATCH',
    body: {
      $type: 'jsonata',
      value: `{ "name": form.name, "externalId": form.externalId, "hint": form.hint, "archiveTime": form.archiveTime and form.archiveNow ? form.archiveTime : (form.archiveNow ? $now() : null) }`,
    },
  },
  buttons: {
    submitButtonText: 'Aktualisieren',
  },
};
