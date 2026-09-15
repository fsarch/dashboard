import { TGeneratedFormDefinition } from '@/components/universals/forms/generated/GeneratedForm.type';

export const UPDATE_PROJECT_FORM: TGeneratedFormDefinition = {
  inputs: [
    { id: 'name', $type: 'text', label: 'Projektname' },
    { id: 'description', $type: 'textarea', label: 'Beschreibung' },
    { id: 'externalId', $type: 'text', label: 'External Id' },
  ],
  initialValues: {
    $type: 'jsonata',
    value: '{ "name": args.project.name, "description": args.project.description, "externalId": args.project.externalId }',
  },
  endpoint: {
    path: {
      $type: 'jsonata',
      value: "'/v1/projects/' & args.project.id",
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
