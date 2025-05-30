'use server';

import { manufacturerService } from "@/services/material-tracing/manufacturer.service";

export async function removeManufacturer(manufacturerId: string): Promise<void> {
  await manufacturerService.deleteManufacturer(manufacturerId);
}
