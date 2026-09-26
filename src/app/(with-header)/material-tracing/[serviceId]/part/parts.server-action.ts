'use server';

import type { TPaginationResult } from '@/services/material-tracing/pagination.type';
import { partService } from '@/services/material-tracing/part.service';
import type { TPart } from '@/services/material-tracing/part.type';
import { getServiceLocalUrl } from '@/utils/getServiceLocalUrl';

type PartWithUrl = TPart & {
  url: string;
};

export async function loadPaginatedPartsAction(options?: {
  skip?: number;
  take?: number;
  search?: string;
  partTypeId?: string;
}): Promise<TPaginationResult<PartWithUrl>> {
  const partsResult = await partService.listParts(options);

  // Add URLs to each part
  const partsWithUrls = await Promise.all(
    partsResult.data.map(async (part) => ({
      ...part,
      url: await getServiceLocalUrl(`/part/${part.id}`),
    })),
  );

  return {
    data: partsWithUrls,
    metadata: partsResult.metadata,
  };
}
