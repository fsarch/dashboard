import { TGeneratedFormDefinition } from '@/components/universals/forms/generated/GeneratedForm.type';

export const CREATE_PARAMETER_FORM: TGeneratedFormDefinition = {
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
        // `body` here is the raw fetched JSON, i.e. our backend's
        // paginated `{ data: [...], metadata: {...} }` list response -
        // hence `body.data`, not `body` directly.
        $type: 'jsonata',
        value: '{ "body": $append([{ "id": "", "value": "", "label": "(kein übergeordnetes Objekt)" }], body.data[type=\'object\'].{ "id": id, "value": id, "label": name }) }',
      },
    },
  },
  initialValues: {
    $type: 'jsonata',
    value: '{ "name": "", "type": "text", "parentId": "", "required": false, "order": 0 }',
  },
  endpoint: {
    path: {
      $type: 'jsonata',
      value: "'/v1/projects/' & args.projectId & '/versions/' & args.versionId & '/parameters'",
    },
    method: 'POST',
    body: {
      $type: 'jsonata',
      value: '{ "name": form.name, "type": form.type, "parentId": form.parentId != \'\' ? form.parentId, "required": form.required, "order": $number(form.order) }',
    },
  },
  postEndpointActions: [{
    $type: 'redirect',
    url: {
      $type: 'jsonata',
      value: "service.localPath & '/project/' & args.projectId & '/version/' & args.versionId & '/parameter'",
    },
  }],
};
