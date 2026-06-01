'use server';

import { partService } from "@/services/material-tracing/part.service";
import { revalidateServicePath } from "@/utils/revalidateServicePath";

export async function deletePartChild(partId: string, childPartId: string): Promise<void> {
  await partService.deletePartPart(partId, childPartId);

  await revalidateServicePath(`/part/${partId}`);
}
