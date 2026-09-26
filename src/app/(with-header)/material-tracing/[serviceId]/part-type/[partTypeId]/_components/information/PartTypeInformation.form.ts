import type {
  TGeneratedFormDefinition,
  TGeneratedFormInput,
} from '@/components/universals/forms/generated/GeneratedForm.type';
import type { TMaterialTracingProductOptions } from '@/utils/configuration.type';

// Siehe part-type.forms.ts (Create-Formular) für die identische Logik/
// denselben Fallback.
const CATALOG_REFERENCE_PLACEHOLDER = '$system.crd.catalog.id';
const PRODUCT_CUSTOM_RESOURCE_ID = 'product';

const buildProductIdInput = (
  productOptions?: TMaterialTracingProductOptions,
): TGeneratedFormInput =>
  productOptions
    ? {
        id: 'productId',
        $type: 'custom-resource-picker',
        label: 'Produkt (product-server)',
        serviceId: productOptions.service_id,
        resourceId: PRODUCT_CUSTOM_RESOURCE_ID,
        refValues: {
          [CATALOG_REFERENCE_PLACEHOLDER]: productOptions.catalog_id,
        },
      }
    : {
        id: 'productId',
        $type: 'select',
        label: 'Produkt (product-server)',
        enableSearch: true,
        data: { $type: 'datasource', value: 'productItems' },
      };

export const buildPartTypeUpdateForm = (
  productOptions?: TMaterialTracingProductOptions,
): TGeneratedFormDefinition => ({
  inputs: [
    {
      id: 'name',
      $type: 'text',
      label: 'Name',
    },
    {
      id: 'externalId',
      $type: 'text',
      label: 'ExternalId',
    },
    buildProductIdInput(productOptions),
    {
      id: 'hint',
      $type: 'text',
      label: 'Hinweis',
    },
    {
      id: 'archiveNow',
      $type: 'checkbox',
      label: 'Archiviert',
      variant: 'toggle',
    },
  ],
  initialValues: {
    $type: 'jsonata',
    // externalId/hint sind am Backend optional (null statt fehlendem Feld
    // möglich) - ungeschützt würde das einen "value prop on input should not
    // be null"-React-Fehler auf den zugehörigen Text-Inputs auslösen, daher
    // wie productId auf "" abgesichert.
    value: `{ "name": args.partType.name, "externalId": $not($exists(args.partType.externalId)) or args.partType.externalId = null ? "" : args.partType.externalId, "productId": $not($exists(args.partType.productId)) or args.partType.productId = null ? "" : args.partType.productId, "hint": $not($exists(args.partType.hint)) or args.partType.hint = null ? "" : args.partType.hint, "archiveTime": args.partType.archiveTime, "archiveNow": $not($exists(args.partType.archiveTime)) or args.partType.archiveTime = null ? false : true }`,
  },
  endpoint: {
    path: {
      $type: 'jsonata',
      value: "'/v1/part-types/' & args.partType.id",
    },
    method: 'PATCH',
    body: {
      $type: 'jsonata',
      value: `{ "name": form.name, "externalId": form.externalId, "productId": form.productId != "" ? form.productId : null, "hint": form.hint, "archiveTime": form.archiveTime and form.archiveNow ? form.archiveTime : (form.archiveNow ? $now() : null) }`,
    },
  },
  dataSources: productOptions
    ? undefined
    : {
        productItems: {
          $type: 'fetch',
          path: '/v1/product-server/items',
          method: 'GET',
          transformResponse: {
            $type: 'jsonata',
            value:
              '{ "body": $append([{ "id": "", "value": "", "label": "Kein Produkt" }], body.data.{ "id": id, "value": id, "label": name }) }',
          },
        },
      },
  buttons: {
    submitButtonText: 'Aktualisieren',
  },
});
