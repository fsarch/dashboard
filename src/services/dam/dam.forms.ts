import { TGeneratedFormDefinition } from '@/components/universals/forms/generated/GeneratedForm.type';
import { TMetadataDataType } from '@/services/file-server/file-server-api.type';

export const COLLECTION_CREATE_FORM: TGeneratedFormDefinition = {
  inputs: [{ id: 'name', $type: 'text', label: 'Name' }],
  initialValues: { name: '' },
  endpoint: {
    path: '/v1/collections',
    method: 'POST',
    body: { $type: 'jsonata', value: '{ "name": form.name }' },
  },
  postEndpointActions: [
    {
      $type: 'redirect',
      url: {
        $type: 'jsonata',
        value: "service.localPath & '/collection/' & response.body.id",
      },
    },
  ],
  buttons: { submitButtonText: 'Sammlung erstellen' },
};

export const COLLECTION_RENAME_FORM = (collectionId: string, currentName: string): TGeneratedFormDefinition => ({
  inputs: [{ id: 'name', $type: 'text', label: 'Name' }],
  initialValues: { name: currentName },
  endpoint: {
    path: `/v1/collections/${collectionId}`,
    method: 'PATCH',
    body: { $type: 'jsonata', value: '{ "name": form.name }' },
  },
  postEndpointActions: [
    {
      $type: 'redirect',
      url: { $type: 'jsonata', value: `service.localPath & '/collection/${collectionId}'` },
    },
  ],
  buttons: { submitButtonText: 'Umbenennen' },
});

export const COLLECTION_ADD_ASSET_FORM = (
  collectionId: string,
  serviceId: string,
): TGeneratedFormDefinition => ({
  inputs: [
    {
      id: 'assetId',
      $type: 'custom-resource-picker',
      label: 'Asset',
      serviceId,
      resourceId: 'asset',
    },
  ],
  initialValues: { assetId: '' },
  endpoint: {
    path: { $type: 'jsonata', value: `'/v1/collections/${collectionId}/assets/' & form.assetId` },
    method: 'POST',
  },
  postEndpointActions: [
    {
      $type: 'redirect',
      url: { $type: 'jsonata', value: `service.localPath & '/collection/${collectionId}'` },
    },
  ],
  buttons: { submitButtonText: 'Zur Sammlung hinzufügen' },
});

export const TAG_CREATE_FORM: TGeneratedFormDefinition = {
  inputs: [{ id: 'key', $type: 'text', label: 'Key' }],
  initialValues: { key: '' },
  endpoint: {
    path: '/v1/tags',
    method: 'POST',
    body: { $type: 'jsonata', value: '{ "key": form.key }' },
  },
  postEndpointActions: [
    { $type: 'redirect', url: { $type: 'jsonata', value: "service.localPath & '/tags'" } },
  ],
  buttons: { submitButtonText: 'Tag erstellen' },
};

export const METADATA_DEFINITION_CREATE_FORM: TGeneratedFormDefinition = {
  inputs: [
    { id: 'key', $type: 'text', label: 'Key' },
    {
      id: 'dataType',
      $type: 'select',
      label: 'Datentyp',
      data: {
        $type: 'constant',
        value: [
          { id: 'string', value: 'string', label: 'Text' },
          { id: 'number', value: 'number', label: 'Zahl' },
          { id: 'boolean', value: 'boolean', label: 'Boolean' },
          { id: 'date', value: 'date', label: 'Datum' },
          { id: 'enum', value: 'enum', label: 'Enum' },
        ],
      },
    },
    {
      id: 'appliesToType',
      $type: 'select',
      label: 'Gilt für Asset-Typ (leer = alle)',
      data: {
        $type: 'constant',
        value: [
          { id: '', value: '', label: 'Alle' },
          { id: 'file', value: 'file', label: 'Datei' },
          { id: 'image', value: 'image', label: 'Bild' },
          { id: 'video', value: 'video', label: 'Video' },
          { id: 'audio', value: 'audio', label: 'Audio' },
          { id: 'document', value: 'document', label: 'Dokument' },
          { id: 'archive', value: 'archive', label: 'Archiv' },
          { id: 'other', value: 'other', label: 'Sonstiges' },
        ],
      },
    },
    {
      id: 'enumValues',
      $type: 'text',
      label: 'Enum-Werte (kommagetrennt, nur bei Datentyp "Enum")',
    },
  ],
  initialValues: { key: '', dataType: 'string', appliesToType: '', enumValues: '' },
  endpoint: {
    path: '/v1/metadata-definitions',
    method: 'POST',
    body: {
      $type: 'jsonata',
      value:
        '$merge([{ "key": form.key, "dataType": form.dataType }, (form.appliesToType != "" ? { "appliesToType": form.appliesToType } : {}), (form.dataType = "enum" ? { "enumValues": $split(form.enumValues, ",").$trim($) } : {})])',
    },
  },
  postEndpointActions: [
    {
      $type: 'redirect',
      url: { $type: 'jsonata', value: "service.localPath & '/metadata-definitions'" },
    },
  ],
  buttons: { submitButtonText: 'Metadaten-Definition erstellen' },
};

export const ASSET_ADD_TAG_FORM = (assetId: string, backPath: string): TGeneratedFormDefinition => ({
  inputs: [
    {
      id: 'tagId',
      $type: 'select',
      label: 'Tag',
      enableSearch: true,
      data: { $type: 'datasource', value: 'tags' },
    },
  ],
  initialValues: { tagId: '' },
  dataSources: {
    tags: {
      $type: 'fetch',
      path: '/v1/tags',
      method: 'GET',
      transformResponse: {
        $type: 'jsonata',
        value: '{ "body": [body.data.{ "id": id, "value": id, "label": key }] }',
      },
    },
  },
  endpoint: {
    path: { $type: 'jsonata', value: `'/v1/assets/${assetId}/tags/' & form.tagId` },
    method: 'POST',
  },
  postEndpointActions: [
    { $type: 'redirect', url: { $type: 'jsonata', value: `service.localPath & '${backPath}'` } },
  ],
  buttons: { submitButtonText: 'Tag hinzufügen' },
});

export const ASSET_SET_METADATA_FORM = (
  assetId: string,
  definitionId: string,
  dataType: TMetadataDataType,
  backPath: string,
): TGeneratedFormDefinition => ({
  inputs: [{
    id: 'value',
    $type: 'text',
    label: dataType === 'number' ? 'Wert (Dezimaltrennzeichen "," oder ".")' : 'Wert',
  }],
  initialValues: { value: '' },
  endpoint: {
    path: `/v1/assets/${assetId}/metadata/${definitionId}`,
    method: 'PUT',
    body: {
      $type: 'jsonata',
      value: dataType === 'number'
        ? '{ "value": $replace(form.value, ",", ".") }'
        : '{ "value": form.value }',
    },
  },
  postEndpointActions: [
    { $type: 'redirect', url: { $type: 'jsonata', value: `service.localPath & '${backPath}'` } },
  ],
  buttons: { submitButtonText: 'Speichern' },
});
