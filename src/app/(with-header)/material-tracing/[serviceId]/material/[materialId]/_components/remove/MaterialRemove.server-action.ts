'use server';

import { materialService } from "@/services/material-tracing/material.service";

export async function removeMaterial(materialId: string): Promise<void> {
  await materialService.deleteMaterial(materialId);
}
