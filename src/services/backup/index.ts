import { fetchService } from '@/utils/fetchService';
import { TBackupJob, TConnector, TStorage, TCreateBackupJobPayload, PaginatedResult } from '@/services/backup/backup';

export async function listConnectors(serviceId: string): Promise<PaginatedResult<TConnector>> {
  const res = await fetchService('/v1/connectors', undefined, { serviceId });
  if (!res.ok) throw new Error('failed to list connectors');
  return res.json();
}

export async function getConnector(id: string): Promise<TConnector> {
  const res = await fetchService(`/v1/connectors/${id}`);
  if (!res.ok) throw new Error('failed to get connector');
  return res.json();
}

export async function createConnector(serviceId: string, payload: any): Promise<TConnector> {
  const res = await fetchService('/v1/connectors', { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } }, { serviceId });
  if (!res.ok) throw new Error('failed to create connector');
  return res.json();
}

export async function updateConnector(serviceId: string, id: string, payload: any): Promise<TConnector> {
  const res = await fetchService(`/v1/connectors/${id}`, { method: 'PUT', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } }, { serviceId });
  if (!res.ok) throw new Error('failed to update connector');
  return res.json();
}

export async function deleteConnector(serviceId: string, id: string): Promise<void> {
  const res = await fetchService(`/v1/connectors/${id}`, { method: 'DELETE' }, { serviceId });
  if (!res.ok) throw new Error('failed to delete connector');
}

export async function listStorages(serviceId: string): Promise<PaginatedResult<TStorage>> {
  const res = await fetchService('/v1/storages', undefined, { serviceId });
  if (!res.ok) throw new Error('failed to list storages');
  return res.json();
}

export async function getStorage(serviceId: string, id: string): Promise<TStorage> {
  const res = await fetchService(`/v1/storages/${id}`, undefined, { serviceId });
  if (!res.ok) throw new Error('failed to get storage');
  return res.json();
}

export async function createStorage(serviceId: string, payload: any): Promise<TStorage> {
  const res = await fetchService('/v1/storages', { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } }, { serviceId });
  if (!res.ok) throw new Error('failed to create storage');
  return res.json();
}

export async function updateStorage(serviceId: string, id: string, payload: any): Promise<TStorage> {
  const res = await fetchService(`/v1/storages/${id}`, { method: 'PUT', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } }, { serviceId });
  if (!res.ok) throw new Error('failed to update storage');
  return res.json();
}

export async function deleteStorage(serviceId: string, id: string): Promise<void> {
  const res = await fetchService(`/v1/storages/${id}`, { method: 'DELETE' }, { serviceId });
  if (!res.ok) throw new Error('failed to delete storage');
}

export async function listBackupJobs(serviceId: string): Promise<PaginatedResult<TBackupJob>> {
  const res = await fetchService('/v1/backup-jobs', undefined, { serviceId });
  if (!res.ok) throw new Error('failed to list backup jobs');
  return res.json();
}

export async function getBackupJob(id: string): Promise<TBackupJob> {
  const res = await fetchService(`/v1/backup-jobs/${id}`);
  if (!res.ok) throw new Error('failed to get backup job');
  return res.json();
}

export async function createBackupJob(serviceId: string, payload: TCreateBackupJobPayload): Promise<TBackupJob> {
  const res = await fetchService('/v1/backup-jobs', { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } }, { serviceId });
  if (!res.ok) throw new Error('failed to create backup job');
  return res.json();
}

export async function updateBackupJob(serviceId: string, id: string, payload: Partial<TCreateBackupJobPayload>): Promise<TBackupJob> {
  const res = await fetchService(`/v1/backup-jobs/${id}`, { method: 'PUT', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } }, { serviceId });
  if (!res.ok) throw new Error('failed to update backup job');
  return res.json();
}

export async function deleteBackupJob(serviceId: string, id: string): Promise<void> {
  const res = await fetchService(`/v1/backup-jobs/${id}`, { method: 'DELETE' }, { serviceId });
  if (!res.ok) throw new Error('failed to delete backup job');
}
