'use server';

import { partService } from "@/services/material-tracing/part.service";
import { revalidateServicePath } from "@/utils/revalidateServicePath";

export type ConnectPartPartShortCode = {
  shortCode: string;
  amount: number;
};

export const connectPartPartShortCode = async ({ value, partId }: { partId: string; value: ConnectPartPartShortCode }) => {
  const parts = await partService.listPartsByShortCode(value.shortCode);

  await Promise.all(parts.map(async (part) => {
    await partService.getOrCreatePartPart(partId, part.id, value.amount);
  }));

  await revalidateServicePath(`/part/${partId}`);
};
