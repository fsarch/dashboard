'use server';

import { partService } from "@/services/material-tracing/part.service";

export async function deletePartChild(partId: string, childPartId: string): Promise<void> {
  await partService.deletePartPart(partId, childPartId);
}
