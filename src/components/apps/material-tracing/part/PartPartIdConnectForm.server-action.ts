'use server';

import { partService } from "@/services/material-tracing/part.service";
import { TPart } from "@/services/material-tracing/part.type";

export type ConnectPartPartId = {
  childPartId: string;
  amount: number;
};

export const connectPartPartId = async ({ value, partId }: { partId: string; value: ConnectPartPartId }) => {
  await partService.getOrCreatePartPart(partId, value.childPartId, value.amount);
};

export const loadAvailableParts = async (partId: string): Promise<TPart[]> => {
  // Load a reasonable number of parts. In production, you might want pagination or search
  const parts = await partService.listParts({ skip: 0, take: 1000 });
  // Filter out the current part to prevent self-connection
  return parts.filter(part => part.id !== partId);
};