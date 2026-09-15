import { TGeneratedFormDefinition } from '@/components/universals/forms/generated/GeneratedForm.type';

export const UPDATE_PARAMETER_FORM: TGeneratedFormDefinition = {
  inputs: [
    { id: 'name', $type: 'text', label: 'Name (Schlüssel im Parameter-Objekt)' },
    {
      id: 'type',
      $type: 'select',
      label: 'Typ',
      data: {
        $type: 'constant',
        value: [
          { id: 'text', value: 'text', label: 'Text' },
          { id: 'number', value: 'number', label: 'Zahl' },
          { id: 'image', value: 'image', label: 'Bild' },
          { id: 'object', value: 'object', label: 'Objekt (verschachtelt)' },
        ],
      },
    },
    {
      id: 'parentId',
      $type: 'select',
      label: 'Übergeordnetes Objekt-Parameter',
      enableSearch: true,
      data: { $type: 'datasource', value: 'objectParameters' },
    },
    { id: 'required', $type: 'checkbox', label: 'Pflichtfeld', variant: 'toggle' },
    { id: 'order', $type: 'number', label: 'Reihenfolge' },
  ],
  dataSources: {
    objectParameters: {
      $type: 'fetch',
      path: {
        $type: 'jsonata',
        value: "'/v1/projects/' & args.projectId & '/versions/' & args.versionId & '/parameters?take=1000'",
      },
      method: 'GET',
      transformResponse: {
        // Excludes the parameter being edited itself, so it can't become
        // its own parent. Deeper cycles (choosing a descendant as parent)
        // aren't guarded here or by the backend - a pre-existing limitation.
        $type: 'jsonata',
        value: '{ "body": $append([{ "id": "", "value": "", "label": "(kein übergeordnetes Objekt)" }], body.data[type=\'object\' and id != args.parameter.id].{ "id": id, "value": id, "label": name }) }',
      },
    },
  },
  initialValues: {
    $type: 'jsonata',
    value: '{ "name": args.parameter.name, "type": args.parameter.type, "parentId": args.parameter.parentId, "required": args.parameter.required, "order": args.parameter.order }',
  },
  endpoint: {
    path: {
      $type: 'jsonata',
      value: "'/v1/projects/' & args.projectId & '/versions/' & args.versionId & '/parameters/' & args.parameter.id",
    },
    method: 'PATCH',
    body: {
      $type: 'jsonata',
      value: '{ "name": form.name, "type": form.type, "parentId": form.parentId != \'\' ? form.parentId, "required": form.required, "order": $number(form.order) }',
    },
  },
  buttons: {
    submitButtonText: 'Aktualisieren',
  },
};
