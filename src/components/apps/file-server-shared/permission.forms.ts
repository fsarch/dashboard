import { TGeneratedFormDefinition } from '@/components/universals/forms/generated/GeneratedForm.type';
import { TPermissionResourceType } from '@/services/file-server/file-server-api.type';

const RESOURCE_CONTROLLER_PATH: Record<TPermissionResourceType, string> = {
  folder: 'folders',
  asset: 'assets',
  collection: 'collections',
};

// Shared by Drive (folder/asset sharing) and DAM (asset/collection sharing) -
// see docs plan "Permissions/ACL": subjectId is a single free-text field
// covering both an OIDC user-sub and a Group id (no GroupPicker datasource,
// since there's no unified "pick a subject" endpoint - see the Gruppen page
// for looking up a Group's id).
export const PERMISSION_GRANT_FORM = (
  resourceType: TPermissionResourceType,
  resourceId: string,
  backPath: string,
): TGeneratedFormDefinition => ({
  inputs: [
    {
      id: 'subjectType',
      $type: 'select',
      label: 'Empfänger-Typ',
      data: {
        $type: 'constant',
        value: [
          { id: 'user', value: 'user', label: 'Nutzer (OIDC-Subject)' },
          { id: 'group', value: 'group', label: 'Gruppe (Group-ID)' },
          { id: 'public', value: 'public', label: 'Öffentlich' },
        ],
      },
    },
    {
      id: 'subjectId',
      $type: 'text',
      label: 'Nutzer- oder Gruppen-ID (leer bei "Öffentlich")',
    },
    {
      id: 'permission',
      $type: 'select',
      label: 'Berechtigung',
      data: {
        $type: 'constant',
        value: [
          { id: 'read', value: 'read', label: 'Lesen' },
          { id: 'write', value: 'write', label: 'Schreiben' },
          { id: 'delete', value: 'delete', label: 'Löschen' },
          { id: 'download', value: 'download', label: 'Download' },
          { id: 'share', value: 'share', label: 'Teilen' },
          { id: 'manage_permissions', value: 'manage_permissions', label: 'Berechtigungen verwalten' },
          { id: 'edit_metadata', value: 'edit_metadata', label: 'Metadaten bearbeiten' },
          { id: 'approve', value: 'approve', label: 'Freigeben' },
          { id: 'publish', value: 'publish', label: 'Veröffentlichen' },
        ],
      },
    },
  ],
  initialValues: { subjectType: 'user', subjectId: '', permission: 'read' },
  endpoint: {
    path: `/v1/${RESOURCE_CONTROLLER_PATH[resourceType]}/${resourceId}/permissions`,
    method: 'POST',
    body: {
      $type: 'jsonata',
      value:
        '$merge([{ "subjectType": form.subjectType, "permission": form.permission }, (form.subjectType != "public" ? { "subjectId": form.subjectId } : {})])',
    },
  },
  postEndpointActions: [
    { $type: 'redirect', url: { $type: 'jsonata', value: `service.localPath & '${backPath}'` } },
  ],
  buttons: { submitButtonText: 'Berechtigung erteilen' },
});
