import { TGeneratedFormDefinition } from '@/components/universals/forms/generated/GeneratedForm.type';

export const UPDATE_PROJECT_FORM: TGeneratedFormDefinition = {
  inputs: [
    {
      id: 'name',
      $type: 'text',
      label: 'Projektname',
    },
    {
      id: 'description',
      $type: 'textarea',
      label: 'Beschreibung',
    },
    {
      id: 'currentVersionId',
      $type: 'select',
      label: 'Aktive Version',
      enableSearch: true,
      data: {
        $type: 'datasource',
        value: 'versions',
      },
    },
  ],
  dataSources: {
    versions: {
      $type: 'fetch',
      path: {
        $type: 'jsonata',
        value: "'/v1/projects/' & args.project.id & '/versions'",
      },
      method: 'GET',
      transformResponse: {
        $type: 'jsonata',
        value: '{ "body": body.{ "id": id, "value": id, "label": id & \' (\' & creationTime & \')\' } }',
      },
    },
  },
  initialValues: {
    $type: 'jsonata',
    value: '{ "name": args.project.name, "description": args.project.description, "currentVersionId": args.project.currentVersionId }',
  },
  endpoint: {
    path: {
      $type: 'jsonata',
      value: "'/v1/projects/' & args.project.id",
    },
    method: 'PATCH',
    body: {
      $type: 'jsonata',
      value: '{ "name": form.name, "description": form.description, "currentVersionId": form.currentVersionId != \'\' ? form.currentVersionId }',
    },
  },
  buttons: {
    submitButtonText: 'Aktualisieren',
  },
};
