import { TGeneratedFormDefinition, TGeneratedFormInput } from "@/components/universals/forms/generated/GeneratedForm.type";
import { TMaterialTracingProductOptions } from "@/utils/configuration.type";

// $system.crd.catalog.id-Referenz des "product"-Custom-Resource-Typs (siehe
// product-server GET /v1/.meta/custom-resources) - muss vorbelegt werden,
// da der Auswahl-Dialog sie sonst über einen zusätzlichen Schritt abfragen
// würde.
const CATALOG_REFERENCE_PLACEHOLDER = '$system.crd.catalog.id';
const PRODUCT_CUSTOM_RESOURCE_ID = 'product';

// productId-Input: ist ein product-Service für diese material-tracing-Instanz
// konfiguriert (config.yml options.product), wird die Produkt-Instanz über
// den SelectCustomResourceDialog direkt am product-Service ausgewählt.
// Andernfalls (ältere/nicht konfigurierte Instanzen) bleibt das bisherige
// Verhalten - ein select-Input, das per Datasource-Proxy alle Produkte des
// material-tracing-Backends selbst lädt.
const buildProductIdInput = (productOptions?: TMaterialTracingProductOptions): TGeneratedFormInput => (
  productOptions ? {
    id: 'productId',
    $type: 'custom-resource-picker',
    label: 'Produkt (product-server)',
    serviceId: productOptions.service_id,
    resourceId: PRODUCT_CUSTOM_RESOURCE_ID,
    refValues: { [CATALOG_REFERENCE_PLACEHOLDER]: productOptions.catalog_id },
  } : {
    id: 'productId',
    $type: 'select',
    label: 'Produkt (product-server)',
    enableSearch: true,
    data: { $type: 'datasource', value: 'productItems' },
  }
);

export const buildPartTypeCreateForm = (productOptions?: TMaterialTracingProductOptions): TGeneratedFormDefinition => ({
  inputs: [{
    id: 'name',
    $type: 'text',
    label: 'Name',
  }, {
    id: 'externalId',
    $type: 'text',
    label: 'ExternalId',
  }, buildProductIdInput(productOptions)],
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
  dataSources: productOptions ? undefined : {
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
});
