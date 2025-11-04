import { TGeneratedFormDefinition } from "@/components/universals/forms/generated/GeneratedForm.type";

export const MATERIAL_TYPE_CREATE_FORM: TGeneratedFormDefinition = {
  inputs: [{
    id: 'name',
    $type: 'text',
    label: 'Name',
  }, {
    id: 'manufacturerId',
    $type: 'select',
    label: 'Manufacturer',
    data: {
      $type: 'datasource',
      value: 'manufacturers',
    },
  }],
  initialValues: {
    $type: 'jsonata',
    value: '{ "name": "", "manufacturerId": dataSource.manufacturers[0].id }'
  },
  endpoint: {
    path: '/v1/material-types',
    method: 'POST',
    body: {
      $type: 'jsonata',
      value: 'form',
    },
  },
  dataSources: {
    manufacturers: {
      $type: 'fetch',
      path: '/v1/manufacturers',
      method: 'GET',
      transformResponse: {
        $type: 'jsonata',
        value: '{ "body": [body.{ "id": id, "value": id, "label": name }] }',
      },
    },
  },
};
