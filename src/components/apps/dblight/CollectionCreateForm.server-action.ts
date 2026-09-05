'use server';

import { revalidatePath } from 'next/cache';
import { dblightService } from '@/services/dblight/dblight.service';
import { TCreateCollectionDto } from '@/services/dblight/dblight.type';

export async function createCollectionAction(
  serviceId: string,
  dto: TCreateCollectionDto,
): Promise<{ id: string }> {
  const collection = await dblightService.createCollection(dto, serviceId);
  revalidatePath(`/dblight/${serviceId}`);
  return { id: collection.id };
}
