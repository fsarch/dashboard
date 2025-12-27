import { fetchService } from '@/utils/fetchService';
import { TBackupJob, TConnector, TStorage, TCreateBackupJobPayload } from '@/types/backup';

export async function listConnectors(serviceId: string): Promise<TConnector[]> {
  const res = await fetchService('/v1/connectors/connectors', undefined, { serviceId });
  if (!res.ok) throw new Error('failed to list connectors');
  return res.json();
}

export async function listStorages(serviceId: string): Promise<TStorage[]> {
  const res = await fetchService('/v1/storages/storages', undefined, { serviceId });
  if (!res.ok) throw new Error('failed to list storages');
  return res.json();
}

export async function listBackupJobs(serviceId: string): Promise<TBackupJob[]> {
  const res = await fetchService('/v1/backup-jobs/backup-jobs', undefined, { serviceId });
  if (!res.ok) throw new Error('failed to list backup jobs');
  return res.json();
}

export async function getBackupJob(serviceId: string, id: string): Promise<TBackupJob> {
  const res = await fetchService(`/v1/backup-jobs/backup-jobs/${id}`, undefined, { serviceId });
  if (!res.ok) throw new Error('failed to get backup job');
  return res.json();
}

export async function createBackupJob(serviceId: string, payload: TCreateBackupJobPayload): Promise<TBackupJob> {
  const res = await fetchService('/v1/backup-jobs/backup-jobs', { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } }, { serviceId });
  if (!res.ok) throw new Error('failed to create backup job');
  return res.json();
}

export async function updateBackupJob(serviceId: string, id: string, payload: Partial<TCreateBackupJobPayload>): Promise<TBackupJob> {
  const res = await fetchService(`/v1/backup-jobs/backup-jobs/${id}`, { method: 'PUT', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } }, { serviceId });
  if (!res.ok) throw new Error('failed to update backup job');
  return res.json();
}

export async function deleteBackupJob(serviceId: string, id: string): Promise<void> {
  const res = await fetchService(`/v1/backup-jobs/backup-jobs/${id}`, { method: 'DELETE' }, { serviceId });
  if (!res.ok) throw new Error('failed to delete backup job');
}

