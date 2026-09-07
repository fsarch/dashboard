import { TGeneratedFormDefinition } from "@/components/universals/forms/generated/GeneratedForm.type";

export const PART_TYPE_UPDATE_FORM: TGeneratedFormDefinition = {
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
  }, {
    id: 'hint',
    $type: 'text',
    label: 'Hinweis',
  }, {
    id: 'archiveNow',
    $type: 'checkbox',
    label: 'Archiviert',
    variant: 'toggle',
  }],
  initialValues: {
    $type: 'jsonata',
    value: `{ "name": args.partType.name, "externalId": args.partType.externalId, "productId": $not($exists(args.partType.productId)) or args.partType.productId = null ? "" : args.partType.productId, "hint": args.partType.hint, "archiveTime": args.partType.archiveTime, "archiveNow": $not($exists(args.partType.archiveTime)) or args.partType.archiveTime = null ? false : true }`
  },
  endpoint: {
    path: {
      $type: 'jsonata',
      value: "'/v1/part-types/' & args.partType.id"
    },
    method: 'PATCH',
    body: {
      $type: 'jsonata',
      value: `{ "name": form.name, "externalId": form.externalId, "productId": form.productId != "" ? form.productId : null, "hint": form.hint, "archiveTime": form.archiveTime and form.archiveNow ? form.archiveTime : (form.archiveNow ? $now() : null) }`,
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
  buttons: {
    submitButtonText: 'Aktualisieren',
  },
};
