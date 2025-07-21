'use server';

import { partService } from "@/services/material-tracing/part.service";

export async function deletePartMaterial(partId: string, materialId: string): Promise<void> {
  await partService.deletePartMaterial(partId, materialId);
}
