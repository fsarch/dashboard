import { TGeneratedFormDefinition } from '@/components/universals/forms/generated/GeneratedForm.type';

export const UPDATE_VERSION_FORM: TGeneratedFormDefinition = {
  inputs: [
    { id: 'width', $type: 'number', label: 'Breite (px)' },
    { id: 'height', $type: 'number', label: 'Höhe (px)' },
    { id: 'externalId', $type: 'text', label: 'External Id' },
  ],
  initialValues: {
    $type: 'jsonata',
    value: '{ "width": args.version.width, "height": args.version.height, "externalId": args.version.externalId }',
  },
  endpoint: {
    path: {
      $type: 'jsonata',
      value: "'/v1/projects/' & args.version.projectId & '/versions/' & args.version.id",
    },
    method: 'PATCH',
    body: {
      $type: 'jsonata',
      value: '{ "width": $number(form.width), "height": $number(form.height), "externalId": form.externalId }',
    },
  },
  buttons: {
    submitButtonText: 'Aktualisieren',
  },
};
