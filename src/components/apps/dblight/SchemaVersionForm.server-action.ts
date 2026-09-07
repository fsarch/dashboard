'use server';

import { revalidatePath } from 'next/cache';
import { dblightService } from '@/services/dblight/dblight.service';

export async function createSchemaVersionAction(
  serviceId: string,
  collectionId: string,
  schema: Record<string, unknown>,
): Promise<{ id: string; version: number }> {
  const created = await dblightService.createSchemaVersion(collectionId, schema, serviceId);
  revalidatePath(`/dblight/${serviceId}/collection/${collectionId}`);
  return { id: created.id, version: created.version };
}
