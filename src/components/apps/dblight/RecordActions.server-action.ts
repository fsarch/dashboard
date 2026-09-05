'use server';

import { revalidatePath } from 'next/cache';
import { dblightService } from '@/services/dblight/dblight.service';

export async function deleteRecordAction(
  serviceId: string,
  collectionId: string,
  recordId: string,
): Promise<void> {
  await dblightService.deleteRecord(collectionId, recordId, serviceId);
  revalidatePath(`/dblight/${serviceId}/collection/${collectionId}/record`);
}
