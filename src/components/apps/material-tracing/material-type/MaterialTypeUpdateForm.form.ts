import { TGeneratedFormDefinition } from "@/components/universals/forms/generated/GeneratedForm.type";

export const MATERIAL_TYPE_UPDATE_FORM_DEFINITION: TGeneratedFormDefinition = {
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
  }, {
    id: 'archiveNow',
    $type: 'checkbox',
    label: 'Archiviert',
  }],
  initialValues: {
    $type: 'jsonata',
    value: `{ 
      "name": args.materialType.name,
      "hint": args.materialType.hint,
      "externalId": args.materialType.externalId,
      "archiveTime": args.materialType.archiveTime,
      "archiveNow": $not($exists(args.materialType.archiveTime)) or args.materialType.archiveTime = null 
        ? false 
        : true
    }`,
  },
  endpoint: {
    path: {
      $type: 'jsonata',
      value: "'/v1/material-types/' & args.materialType.id"
    },
    method: 'PATCH',
    body: {
      $type: 'jsonata',
      value: `{ 
        "name": form.name, 
        "hint": form.hint, 
        "externalId": form.externalId, 
        "archiveTime": form.archiveTime and form.archiveNow 
          ? form.archiveTime
          : (
            form.archiveNow ? $now() : null
          )
      }`,
    },
  },
  buttons: {
    submitButtonText: 'Aktualisieren',
  },
};
