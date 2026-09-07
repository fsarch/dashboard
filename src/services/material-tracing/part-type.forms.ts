import { TGeneratedFormDefinition } from "@/components/universals/forms/generated/GeneratedForm.type";

export const PART_TYPE_CREATE_FORM: TGeneratedFormDefinition = {
  inputs: [{
    id: 'name',
    $type: 'text',
    label: 'Name',
  }, {
    id: 'externalId',
    $type: 'text',
    label: 'ExternalId',
  }, {
    id: 'productId',
    $type: 'select',
    label: 'Produkt (product-server)',
    enableSearch: true,
    data: { $type: 'datasource', value: 'productItems' },
  }],
  initialValues: {
    $type: 'jsonata',
    value: '{ "name": "", "externalId": "", "productId": "" }'
  },
  endpoint: {
    path: '/v1/part-types',
    method: 'POST',
    body: {
      $type: 'jsonata',
      value: '{ "name": form.name, "externalId": form.externalId != "" ? form.externalId : null, "productId": form.productId != "" ? form.productId : null }',
    },
  },
  dataSources: {
    productItems: {
      $type: 'fetch',
      path: '/v1/product-server/items',
      method: 'GET',
      transformResponse: {
        $type: 'jsonata',
        value: '{ "body": $append([{ "id": "", "value": "", "label": "Kein Produkt" }], body.data.{ "id": id, "value": id, "label": name }) }',
      },
    },
  },
};
