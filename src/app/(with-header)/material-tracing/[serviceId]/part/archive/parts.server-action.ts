'use server';

import { partService } from "@/services/material-tracing/part.service";
import { TPart } from "@/services/material-tracing/part.type";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";

type PartWithUrl = TPart & {
  url: string;
};

export async function loadArchivedPartsAction(options?: { skip?: number; take?: number }): Promise<PartWithUrl[]> {
  const parts = await partService.listParts({
    isArchived: true,
    skip: options?.skip,
    take: options?.take,
  });

  // Add URLs to each part
  const partsWithUrls = await Promise.all(
    parts.map(async (part) => ({
      ...part,
      url: await getServiceLocalUrl(`/part/${part.id}`)
    }))
  );

  return partsWithUrls;
}
