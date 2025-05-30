'use server';

import { materialTypeService } from "@/services/material-tracing/material-type.service";

export async function removeMaterialType(manufacturerId: string): Promise<void> {
  await materialTypeService.deleteMaterialType(manufacturerId);
}
