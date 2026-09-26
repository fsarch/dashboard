// Mirrors file-server's DTOs/enums 1:1 (see file-server's src/models/*.model.ts
// and src/constants/*.enum.ts) - kept as plain string literal unions here
// instead of importing the backend package, since the dashboard never shares
// code with backend services.

export type TPaginationMetadata = {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export type TPaginationResult<T> = {
  data: T[];
  metadata: TPaginationMetadata;
};

export type TAssetType =
  | 'file'
  | 'image'
  | 'video'
  | 'audio'
  | 'document'
  | 'archive'
  | 'other';

export type TMetadataDataType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'date'
  | 'enum';

export type TPermissionResourceType = 'folder' | 'asset' | 'collection';

export type TPermissionSubjectType = 'user' | 'group' | 'public';

export type TPermissionType =
  | 'read'
  | 'write'
  | 'delete'
  | 'download'
  | 'share'
  | 'manage_permissions'
  | 'edit_metadata'
  | 'approve'
  | 'publish';

export type TUploadStatus = 'pending' | 'uploaded' | 'completed' | 'aborted';

export type TFolderPathEntry = {
  id: string;
  name: string;
};

export type TFolder = {
  id: string;
  parentId: string | null;
  name: string;
  createdBy: string;
  creationTime: string;
  updateTime: string;
};

export type TFolderWithPath = TFolder & {
  path: TFolderPathEntry[];
};

export type TAsset = {
  id: string;
  parentId: string | null;
  type: TAssetType;
  name: string;
  mimeType: string | null;
  size: number | null;
  currentVersionId: string | null;
  createdBy: string;
  creationTime: string;
  updateTime: string;
};

export type TAssetVersion = {
  id: string;
  assetId: string;
  versionNumber: number;
  mimeType: string | null;
  size: number;
  checksumSha256: string | null;
  createdBy: string;
  creationTime: string;
};

export type TUpload = {
  id: string;
  assetId: string;
  versionNumber: number;
  status: TUploadStatus;
  // Presigned direct-upload URL (S3 backend only). Absent for the filesystem
  // backend - PUT the content through the /upload/[uploadId] proxy route instead.
  uploadUrl?: string;
};

export type TCreateAssetResponse = {
  asset: TAsset;
  upload: TUpload;
};

export type TCollection = {
  id: string;
  name: string;
  createdBy: string;
  creationTime: string;
  updateTime: string;
};

export type TTag = {
  id: string;
  key: string;
  createdBy: string;
  creationTime: string;
};

export type TMetadataDefinition = {
  id: string;
  key: string;
  dataType: TMetadataDataType;
  appliesToType: TAssetType | null;
  enumValues: string[] | null;
  createdBy: string;
  creationTime: string;
  updateTime: string;
};

export type TAssetMetadataValue = {
  definitionId: string;
  key: string;
  dataType: TMetadataDataType;
  value: string;
  updatedBy: string;
  updateTime: string;
};

export type TGroup = {
  id: string;
  name: string;
  permissionResourceId: string;
  createdBy: string;
  creationTime: string;
  updateTime: string;
};

export type TPermission = {
  id: string;
  resourceType: TPermissionResourceType;
  resourceId: string;
  subjectType: TPermissionSubjectType;
  subjectId: string | null;
  permission: TPermissionType;
  createdBy: string;
  creationTime: string;
};

export type TTrash = {
  folders: TPaginationResult<TFolder>;
  assets: TPaginationResult<TAsset>;
  collections: TPaginationResult<TCollection>;
};

export type TFolderChildren = {
  folders: TPaginationResult<TFolder>;
  assets: TPaginationResult<TAsset>;
};
