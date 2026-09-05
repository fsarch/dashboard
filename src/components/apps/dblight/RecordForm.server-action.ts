'use server';

import { revalidatePath } from 'next/cache';
import { dblightService } from '@/services/dblight/dblight.service';

export async function createRecordAction(
  serviceId: string,
  collectionId: string,
  data: Record<string, unknown>,
): Promise<{ id: string }> {
  const record = await dblightService.createRecord(collectionId, data, serviceId);
  revalidatePath(`/dblight/${serviceId}/collection/${collectionId}/record`);
  return { id: record.id };
}

export async function replaceRecordAction(
  serviceId: string,
  collectionId: string,
  recordId: string,
  data: Record<string, unknown>,
): Promise<void> {
  await dblightService.replaceRecord(collectionId, recordId, data, serviceId);
  revalidatePath(`/dblight/${serviceId}/collection/${collectionId}/record`);
  revalidatePath(`/dblight/${serviceId}/collection/${collectionId}/record/${recordId}`);
}
