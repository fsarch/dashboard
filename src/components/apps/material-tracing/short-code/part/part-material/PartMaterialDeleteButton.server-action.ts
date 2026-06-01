'use server';

import { partService } from "@/services/material-tracing/part.service";
import { revalidateServicePath } from "@/utils/revalidateServicePath";

export async function deletePartMaterial(partId: string, materialId: string): Promise<void> {
  await partService.deletePartMaterial(partId, materialId);

  await revalidateServicePath(`/part/${partId}`);
}
