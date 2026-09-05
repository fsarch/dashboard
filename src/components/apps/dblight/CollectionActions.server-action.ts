'use server';

import { revalidatePath } from 'next/cache';
import { dblightService } from '@/services/dblight/dblight.service';

export async function deleteCollectionAction(
  serviceId: string,
  collectionId: string,
): Promise<void> {
  await dblightService.deleteCollection(collectionId, serviceId);
  revalidatePath(`/dblight/${serviceId}`);
}
