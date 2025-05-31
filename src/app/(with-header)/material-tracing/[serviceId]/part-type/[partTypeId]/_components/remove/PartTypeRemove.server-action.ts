'use server';

import { partTypeService } from "@/services/material-tracing/part-type.service";

export async function removePartType(partTypeId: string): Promise<void> {
  await partTypeService.deletePartType(partTypeId);
}
