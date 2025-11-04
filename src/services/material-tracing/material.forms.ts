import { TGeneratedFormDefinition } from "@/components/universals/forms/generated/GeneratedForm.type";

export const MATERIAL_CREATE_FORM: TGeneratedFormDefinition = {
  inputs: [{
    id: 'name',
    $type: 'text',
    label: 'Name',
  }, {
    id: 'materialTypeId',
    $type: 'select',
    label: 'Material Type',
    enableSearch: true,
    data: {
      $type: 'datasource',
      value: 'materialTypes',
    },
  }, {
    id: 'imageRef',
    $type: 'image-server-upload',
    label: 'Bild',
    imageServerAdminUrl: {
      $type: 'datasource',
      value: 'imageServerAdminUrl',
    },
    transformResponse: {
      $type: 'jsonata',
      value: '{ "body": body.id }',
    },
    preferCapture: 'environment',
  }],
  initialValues: {
    $type: 'jsonata',
    value: '{ "name": "", "materialTypeId": dataSource.materialTypes[0].id }'
  },
  endpoint: {
    path: '/v1/materials',
    method: 'POST',
    body: {
      $type: 'jsonata',
      value: 'form',
    },
  },
  postEndpointActions: [{
    $type: 'redirect',
    url: {
      $type: 'jsonata',
      value: "service.localPath & '/material/' & response.body.id",
    },
  }],
  dataSources: {
    materialTypes: {
      $type: 'fetch',
      path: '/v1/material-types',
      method: 'GET',
      transformResponse: {
        $type: 'jsonata',
        value: '{ "body": [body.{ "id": id, "value": id, "label": name }] }',
      },
    },
    imageServerAdminUrl: {
      $type: 'fetch',
      path: '/v1/.meta/user-interface',
      method: 'GET',
      transformResponse: {
        $type: 'jsonata',
        value: '{ "body": body.imageServer.adminUrl }',
      },
    },
  },
};
