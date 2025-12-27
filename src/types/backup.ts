export type TConnector = {
  id: string;
  // minimal shape - extend per API
  [key: string]: any;
}

export type TStorage = {
  id: string;
  // minimal shape - extend per API
  [key: string]: any;
}

export type TBackupJobStatus = 'pending' | 'running' | 'success' | 'failed' | string;

export type TBackupJob = {
  id: string;
  status: TBackupJobStatus;
  createdAt?: string;
  connectorId?: string;
  storageId?: string;
  [key: string]: any;
}

export type TCreateBackupJobPayload = {
  connectorId: string;
  storageId: string;
  options?: Record<string, any>;
}

