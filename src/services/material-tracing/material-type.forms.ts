import type { TGeneratedFormDefinition } from '@/components/universals/forms/generated/GeneratedForm.type';

// "manufacturer"-Custom-Resource-Typ des material-tracing-Backends (siehe
// GET /v1/.meta/custom-resources) - der Auswahl-Dialog blättert seitenweise
// durch alle Hersteller, statt wie ein select-Input nur die erste Seite
// (Backend-Default take=25) von /v1/manufacturers zu laden.
const MANUFACTURER_CUSTOM_RESOURCE_ID = 'manufacturer';

export const buildMaterialTypeCreateForm = (
  serviceId: string,
): TGeneratedFormDefinition => ({
  inputs: [
    {
      id: 'name',
      $type: 'text',
      label: 'Name',
    },
    {
      id: 'manufacturerId',
      $type: 'custom-resource-picker',
      label: 'Manufacturer',
      serviceId,
      resourceId: MANUFACTURER_CUSTOM_RESOURCE_ID,
    },
  ],
  initialValues: { name: '', manufacturerId: '' },
  endpoint: {
    path: '/v1/material-types',
    method: 'POST',
    body: {
      $type: 'jsonata',
      value: 'form',
    },
  },
});
