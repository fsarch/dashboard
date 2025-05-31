'use server';

import { partService } from "@/services/material-tracing/part.service";

export async function removePart(partId: string): Promise<void> {
  await partService.deletePart(partId);
}
