import { TGeneratedFormDefinition } from '@/components/universals/forms/generated/GeneratedForm.type';

export const UPDATE_VERSION_FORM: TGeneratedFormDefinition = {
  inputs: [
    {
      id: 'name',
      $type: 'text',
      label: 'Name',
    },
    {
      id: 'description',
      $type: 'textarea',
      label: 'Beschreibung',
    },
    {
      id: 'externalId',
      $type: 'text',
      label: 'External Id',
    },
  ],
  initialValues: {
    $type: 'jsonata',
    value: '{ "name": args.version.name, "description": args.version.description, "externalId": args.version.externalId }',
  },
  endpoint: {
    path: {
      $type: 'jsonata',
      value: "'/v1/projects/' & args.version.projectId & '/versions/' & args.version.id",
    },
    method: 'PATCH',
    body: {
      $type: 'jsonata',
      value: '{ "name": form.name, "description": form.description, "externalId": form.externalId }',
    },
  },
  buttons: {
    submitButtonText: 'Aktualisieren',
  },
};
