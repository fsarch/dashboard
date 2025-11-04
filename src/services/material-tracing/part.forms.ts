import { TGeneratedFormDefinition } from "@/components/universals/forms/generated/GeneratedForm.type";

export const PART_CREATE_FORM: TGeneratedFormDefinition = {
  inputs: [{
    id: 'name',
    $type: 'text',
    label: 'Name',
  }, {
    id: 'amount',
    $type: 'text',
    label: 'Amount',
  }, {
    id: 'partTypeId',
    $type: 'select',
    label: 'Part Type',
    enableSearch: true,
    data: {
      $type: 'datasource',
      value: 'partTypes',
    },
  }],
  initialValues: {
    $type: 'jsonata',
    value: '{ "name": "", "partTypeId": dataSource.partTypes[0].id, "amount": 1 }'
  },
  endpoint: {
    path: '/v1/parts',
    method: 'POST',
    body: {
      $type: 'jsonata',
      value: '{ "name": form.name, "partTypeId": form.partTypeId, "amount": $number(form.amount) }',
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
