import { fetchService } from '@/utils/fetchService';
import {
  TAsset,
  TAssetMetadataValue,
  TAssetVersion,
  TCollection,
  TCreateAssetResponse,
  TFolder,
  TFolderChildren,
  TFolderWithPath,
  TGroup,
  TMetadataDefinition,
  TPaginationResult,
  TPermission,
  TPermissionResourceType,
  TPermissionSubjectType,
  TPermissionType,
  TTag,
  TTrash,
  TUpload,
} from '@/services/file-server/file-server-api.type';

const JSON_HEADERS = { 'Content-Type': 'application/json' };

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`file-server request failed (${res.status}): ${body}`);
  }
  return res.json();
}

async function empty(res: Response): Promise<void> {
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`file-server request failed (${res.status}): ${body}`);
  }
}

// region Folders
const listFolders = async (
  parentId: string | null,
  page = 1,
  pageSize = 100,
): Promise<TPaginationResult<TFolder>> => {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (parentId) {
    params.set('parentId', parentId);
  }
  return json(await fetchService(`/v1/folders?${params.toString()}`));
};

const getFolder = async (id: string): Promise<TFolderWithPath> =>
  json(await fetchService(`/v1/folders/${id}`));

const getFolderChildren = async (
  id: string,
  page = 1,
  pageSize = 100,
): Promise<TFolderChildren> => {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  return json(await fetchService(`/v1/folders/${id}/children?${params.toString()}`));
};

const createFolder = async (data: { name: string; parentId?: string | null }): Promise<TFolder> =>
  json(
    await fetchService('/v1/folders', {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify(data),
    }),
  );

const renameFolder = async (id: string, name: string): Promise<TFolder> =>
  json(
    await fetchService(`/v1/folders/${id}`, {
      method: 'PATCH',
      headers: JSON_HEADERS,
      body: JSON.stringify({ name }),
    }),
  );

const moveFolder = async (id: string, parentId: string | null): Promise<TFolder> =>
  json(
    await fetchService(`/v1/folders/${id}/move`, {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify({ parentId }),
    }),
  );

const deleteFolder = async (id: string): Promise<void> =>
  empty(await fetchService(`/v1/folders/${id}`, { method: 'DELETE' }));

const restoreFolder = async (id: string): Promise<TFolder> =>
  json(await fetchService(`/v1/folders/${id}/restore`, { method: 'POST' }));
// endregion

// region Assets
const listAssets = async (
  parentId: string | null,
  page = 1,
  pageSize = 100,
): Promise<TPaginationResult<TAsset>> => {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (parentId) {
    params.set('parentId', parentId);
  }
  return json(await fetchService(`/v1/assets?${params.toString()}`));
};

const getAsset = async (id: string): Promise<TAsset> =>
  json(await fetchService(`/v1/assets/${id}`));

const createAsset = async (data: {
  name: string;
  parentId?: string | null;
  mimeType?: string;
  expectedSize?: number;
}): Promise<TCreateAssetResponse> =>
  json(
    await fetchService('/v1/assets', {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify(data),
    }),
  );

const renameAsset = async (id: string, name: string): Promise<TAsset> =>
  json(
    await fetchService(`/v1/assets/${id}`, {
      method: 'PATCH',
      headers: JSON_HEADERS,
      body: JSON.stringify({ name }),
    }),
  );

const moveAsset = async (id: string, parentId: string | null): Promise<TAsset> =>
  json(
    await fetchService(`/v1/assets/${id}/move`, {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify({ parentId }),
    }),
  );

const deleteAsset = async (id: string): Promise<void> =>
  empty(await fetchService(`/v1/assets/${id}`, { method: 'DELETE' }));

const restoreAsset = async (id: string): Promise<TAsset> =>
  json(await fetchService(`/v1/assets/${id}/restore`, { method: 'POST' }));

// Follows the redirect (S3 presigned URL) or streams the filesystem-backend
// body transparently - `fetch` resolves both to one final Response either way.
const fetchAssetContent = (id: string, disposition: 'content' | 'download', range?: string): Promise<Response> =>
  fetchService(`/v1/assets/${id}/${disposition === 'download' ? 'download' : 'content'}`, {
    headers: range ? { Range: range } : undefined,
  });

const listAssetVersions = async (assetId: string): Promise<TAssetVersion[]> =>
  json(await fetchService(`/v1/assets/${assetId}/versions`));

const createAssetVersion = async (
  assetId: string,
  data: { mimeType?: string; expectedSize?: number },
): Promise<TUpload> =>
  json(
    await fetchService(`/v1/assets/${assetId}/versions`, {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify(data),
    }),
  );

const restoreAssetVersion = async (assetId: string, versionId: string): Promise<TAsset> =>
  json(
    await fetchService(`/v1/assets/${assetId}/versions/${versionId}/restore`, {
      method: 'POST',
    }),
  );

const removeAssetVersion = async (assetId: string, versionId: string): Promise<void> =>
  empty(
    await fetchService(`/v1/assets/${assetId}/versions/${versionId}`, {
      method: 'DELETE',
    }),
  );

const listAssetMetadata = async (assetId: string): Promise<TAssetMetadataValue[]> =>
  json(await fetchService(`/v1/assets/${assetId}/metadata`));

const setAssetMetadata = async (assetId: string, definitionId: string, value: string): Promise<void> =>
  empty(
    await fetchService(`/v1/assets/${assetId}/metadata/${definitionId}`, {
      method: 'PUT',
      headers: JSON_HEADERS,
      body: JSON.stringify({ value }),
    }),
  );

const removeAssetMetadata = async (assetId: string, definitionId: string): Promise<void> =>
  empty(
    await fetchService(`/v1/assets/${assetId}/metadata/${definitionId}`, {
      method: 'DELETE',
    }),
  );

const listAssetTags = async (assetId: string): Promise<TTag[]> =>
  json(await fetchService(`/v1/assets/${assetId}/tags`));

const addAssetTag = async (assetId: string, tagId: string): Promise<void> =>
  empty(await fetchService(`/v1/assets/${assetId}/tags/${tagId}`, { method: 'POST' }));

const removeAssetTag = async (assetId: string, tagId: string): Promise<void> =>
  empty(await fetchService(`/v1/assets/${assetId}/tags/${tagId}`, { method: 'DELETE' }));

const listAssetCollections = async (assetId: string): Promise<TCollection[]> =>
  json(await fetchService(`/v1/assets/${assetId}/collections`));
// endregion

// region Uploads
const uploadContent = async (uploadId: string, body: BodyInit, contentType: string | null): Promise<TUpload> =>
  json(
    await fetchService(`/v1/uploads/${uploadId}/content`, {
      method: 'PUT',
      headers: contentType ? { 'Content-Type': contentType } : undefined,
      body,
      // @ts-expect-error -- required by undici when streaming a body from a Route Handler
      duplex: 'half',
    }),
  );

const completeUpload = async (uploadId: string): Promise<{ asset: TAsset; version: TAssetVersion }> =>
  json(await fetchService(`/v1/uploads/${uploadId}/complete`, { method: 'POST' }));

const abortUpload = async (uploadId: string): Promise<void> =>
  empty(await fetchService(`/v1/uploads/${uploadId}`, { method: 'DELETE' }));
// endregion

// region Collections
const listCollections = async (page = 1, pageSize = 100): Promise<TPaginationResult<TCollection>> => {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  return json(await fetchService(`/v1/collections?${params.toString()}`));
};

const getCollection = async (id: string): Promise<TCollection> =>
  json(await fetchService(`/v1/collections/${id}`));

const createCollection = async (name: string): Promise<TCollection> =>
  json(
    await fetchService('/v1/collections', {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify({ name }),
    }),
  );

const renameCollection = async (id: string, name: string): Promise<TCollection> =>
  json(
    await fetchService(`/v1/collections/${id}`, {
      method: 'PATCH',
      headers: JSON_HEADERS,
      body: JSON.stringify({ name }),
    }),
  );

const deleteCollection = async (id: string): Promise<void> =>
  empty(await fetchService(`/v1/collections/${id}`, { method: 'DELETE' }));

const restoreCollection = async (id: string): Promise<TCollection> =>
  json(await fetchService(`/v1/collections/${id}/restore`, { method: 'POST' }));

const listCollectionAssets = async (
  id: string,
  page = 1,
  pageSize = 100,
): Promise<TPaginationResult<TAsset>> => {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  return json(await fetchService(`/v1/collections/${id}/assets?${params.toString()}`));
};

const addAssetToCollection = async (id: string, assetId: string): Promise<void> =>
  empty(await fetchService(`/v1/collections/${id}/assets/${assetId}`, { method: 'POST' }));

const removeAssetFromCollection = async (id: string, assetId: string): Promise<void> =>
  empty(await fetchService(`/v1/collections/${id}/assets/${assetId}`, { method: 'DELETE' }));
// endregion

// region Groups
const listGroups = async (): Promise<TGroup[]> => {
  const result: TPaginationResult<TGroup> = await json(
    await fetchService('/v1/groups?pageSize=1000'),
  );
  return result.data;
};

const getGroup = async (id: string): Promise<TGroup> => json(await fetchService(`/v1/groups/${id}`));

const createGroup = async (data: { name: string; permissionResourceId: string }): Promise<TGroup> =>
  json(
    await fetchService('/v1/groups', {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify(data),
    }),
  );

const renameGroup = async (id: string, name: string): Promise<TGroup> =>
  json(
    await fetchService(`/v1/groups/${id}`, {
      method: 'PATCH',
      headers: JSON_HEADERS,
      body: JSON.stringify({ name }),
    }),
  );

const deleteGroup = async (id: string): Promise<void> =>
  empty(await fetchService(`/v1/groups/${id}`, { method: 'DELETE' }));

const restoreGroup = async (id: string): Promise<TGroup> =>
  json(await fetchService(`/v1/groups/${id}/restore`, { method: 'POST' }));
// endregion

// region Tags
const listTags = async (): Promise<TTag[]> => {
  const result: TPaginationResult<TTag> = await json(
    await fetchService('/v1/tags?pageSize=1000'),
  );
  return result.data;
};

const createTag = async (key: string): Promise<TTag> =>
  json(
    await fetchService('/v1/tags', {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify({ key }),
    }),
  );

const deleteTag = async (id: string): Promise<void> =>
  empty(await fetchService(`/v1/tags/${id}`, { method: 'DELETE' }));
// endregion

// region Metadata definitions
const listMetadataDefinitions = async (): Promise<TMetadataDefinition[]> => {
  const result: TPaginationResult<TMetadataDefinition> = await json(
    await fetchService('/v1/metadata-definitions?pageSize=1000'),
  );
  return result.data;
};

const getMetadataDefinition = async (id: string): Promise<TMetadataDefinition> =>
  json(await fetchService(`/v1/metadata-definitions/${id}`));

const createMetadataDefinition = async (data: {
  key: string;
  dataType: string;
  appliesToType?: string;
  enumValues?: string[];
}): Promise<TMetadataDefinition> =>
  json(
    await fetchService('/v1/metadata-definitions', {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify(data),
    }),
  );

const deleteMetadataDefinition = async (id: string): Promise<void> =>
  empty(await fetchService(`/v1/metadata-definitions/${id}`, { method: 'DELETE' }));

const restoreMetadataDefinition = async (id: string): Promise<TMetadataDefinition> =>
  json(await fetchService(`/v1/metadata-definitions/${id}/restore`, { method: 'POST' }));
// endregion

// region Permissions
const RESOURCE_CONTROLLER_PATH: Record<TPermissionResourceType, string> = {
  folder: 'folders',
  asset: 'assets',
  collection: 'collections',
};

const listPermissions = async (
  resourceType: TPermissionResourceType,
  resourceId: string,
): Promise<TPermission[]> =>
  json(await fetchService(`/v1/${RESOURCE_CONTROLLER_PATH[resourceType]}/${resourceId}/permissions`));

const grantPermission = async (
  resourceType: TPermissionResourceType,
  resourceId: string,
  data: { subjectType: TPermissionSubjectType; subjectId?: string; permission: TPermissionType },
): Promise<TPermission> =>
  json(
    await fetchService(`/v1/${RESOURCE_CONTROLLER_PATH[resourceType]}/${resourceId}/permissions`, {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify(data),
    }),
  );

const revokePermission = async (
  resourceType: TPermissionResourceType,
  resourceId: string,
  permissionId: string,
): Promise<void> =>
  empty(
    await fetchService(
      `/v1/${RESOURCE_CONTROLLER_PATH[resourceType]}/${resourceId}/permissions/${permissionId}`,
      { method: 'DELETE' },
    ),
  );
// endregion

// region Trash
const listTrash = async (page = 1, pageSize = 100): Promise<TTrash> => {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  return json(await fetchService(`/v1/trash?${params.toString()}`));
};
// endregion

export const fileServerApiService = {
  listFolders,
  getFolder,
  getFolderChildren,
  createFolder,
  renameFolder,
  moveFolder,
  deleteFolder,
  restoreFolder,
  listAssets,
  getAsset,
  createAsset,
  renameAsset,
  moveAsset,
  deleteAsset,
  restoreAsset,
  fetchAssetContent,
  listAssetVersions,
  createAssetVersion,
  restoreAssetVersion,
  removeAssetVersion,
  listAssetMetadata,
  setAssetMetadata,
  removeAssetMetadata,
  listAssetTags,
  addAssetTag,
  removeAssetTag,
  listAssetCollections,
  uploadContent,
  completeUpload,
  abortUpload,
  listCollections,
  getCollection,
  createCollection,
  renameCollection,
  deleteCollection,
  restoreCollection,
  listCollectionAssets,
  addAssetToCollection,
  removeAssetFromCollection,
  listGroups,
  getGroup,
  createGroup,
  renameGroup,
  deleteGroup,
  restoreGroup,
  listTags,
  createTag,
  deleteTag,
  listMetadataDefinitions,
  getMetadataDefinition,
  createMetadataDefinition,
  deleteMetadataDefinition,
  restoreMetadataDefinition,
  listPermissions,
  grantPermission,
  revokePermission,
  listTrash,
};
