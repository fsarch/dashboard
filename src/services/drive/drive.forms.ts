import type { TGeneratedFormDefinition } from '@/components/universals/forms/generated/GeneratedForm.type';

const folderPath = (parentId: string | null): string =>
  parentId ? `/folder/${parentId}` : '';

export const FOLDER_CREATE_FORM = (
  parentId: string | null,
): TGeneratedFormDefinition => ({
  inputs: [{ id: 'name', $type: 'text', label: 'Name' }],
  initialValues: { name: '' },
  endpoint: {
    path: '/v1/folders',
    method: 'POST',
    body: {
      $type: 'jsonata',
      value: parentId
        ? `{ "name": form.name, "parentId": "${parentId}" }`
        : '{ "name": form.name }',
    },
  },
  postEndpointActions: [
    {
      $type: 'redirect',
      url: {
        $type: 'jsonata',
        value: `service.localPath & '${folderPath(parentId)}'`,
      },
    },
  ],
  buttons: { submitButtonText: 'Ordner erstellen' },
});

export const ASSET_RENAME_FORM = (
  assetId: string,
  currentName: string,
  backPath: string,
): TGeneratedFormDefinition => ({
  inputs: [{ id: 'name', $type: 'text', label: 'Name' }],
  initialValues: { name: currentName },
  endpoint: {
    path: `/v1/assets/${assetId}`,
    method: 'PATCH',
    body: { $type: 'jsonata', value: '{ "name": form.name }' },
  },
  postEndpointActions: [
    {
      $type: 'redirect',
      url: { $type: 'jsonata', value: `service.localPath & '${backPath}'` },
    },
  ],
  buttons: { submitButtonText: 'Umbenennen' },
});

export const GROUP_CREATE_FORM: TGeneratedFormDefinition = {
  inputs: [
    { id: 'name', $type: 'text', label: 'Name' },
    {
      id: 'permissionResourceId',
      $type: 'text',
      label: 'Permission-Resource-ID (aus fsarch UAC "file-server:group")',
    },
  ],
  initialValues: { name: '', permissionResourceId: '' },
  endpoint: {
    path: '/v1/groups',
    method: 'POST',
    body: {
      $type: 'jsonata',
      value:
        '{ "name": form.name, "permissionResourceId": form.permissionResourceId }',
    },
  },
  postEndpointActions: [
    {
      $type: 'redirect',
      url: { $type: 'jsonata', value: "service.localPath & '/groups'" },
    },
  ],
  buttons: { submitButtonText: 'Gruppe erstellen' },
};
