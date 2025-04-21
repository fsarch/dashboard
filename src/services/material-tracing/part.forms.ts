import { TGeneratedFormDefinition } from "@/components/universals/forms/generated/GeneratedForm.type";

export const PART_CREATE_FORM: TGeneratedFormDefinition = {
  inputs: [{
    id: 'name',
    type: 'text',
    label: 'Name',
  }, {
    id: 'partTypeId',
    type: 'select',
    label: 'Part Type',
    data: {
      $type: 'datasource',
      value: 'partTypes',
    },
  }],
  initialValues: {
    $type: 'jsonata',
    value: '{ "name": "", "partTypeId": dataSource.partTypes[0].id }'
  },
  endpoint: {
    path: '/v1/parts',
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
      value: "service.localPath & '/part/' & response.body.id",
    },
  }],
  dataSources: {
    partTypes: {
      $type: 'fetch',
      path: '/v1/part-types',
      method: 'GET',
      transformResponse: {
        $type: 'jsonata',
        value: '{ "body": [body.{ "id": id, "value": id, "label": name }] }',
      },
    },
  },
};
