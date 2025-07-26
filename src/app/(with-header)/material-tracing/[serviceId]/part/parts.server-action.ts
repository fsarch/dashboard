'use server';

import { partService } from "@/services/material-tracing/part.service";
import { TPart } from "@/services/material-tracing/part.type";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";

type PartWithUrl = TPart & {
  url: string;
};

export async function loadPartsAction(options?: { skip?: number; take?: number }): Promise<PartWithUrl[]> {
  const parts = await partService.listParts(options);
  
  // Add URLs to each part
  const partsWithUrls = await Promise.all(
    parts.map(async (part) => ({
      ...part,
      url: await getServiceLocalUrl(`/part/${part.id}`)
    }))
  );
  
  return partsWithUrls;
}