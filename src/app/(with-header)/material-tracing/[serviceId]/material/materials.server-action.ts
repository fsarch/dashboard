'use server';

import { materialService } from '@/services/material-tracing/material.service';
import type { TMaterial } from '@/services/material-tracing/material.type';
import type { TPaginationResult } from '@/services/material-tracing/pagination.type';
import { getServiceLocalUrl } from '@/utils/getServiceLocalUrl';

type MaterialWithUrl = TMaterial & {
  url: string;
};

export async function loadMaterialsAction(options?: {
  skip?: number;
  take?: number;
  search?: string;
}): Promise<TPaginationResult<MaterialWithUrl>> {
  const materialsResult = await materialService.listMaterials(options);

  const materialsWithUrls = await Promise.all(
    materialsResult.data.map(async (material) => ({
      ...material,
      url: await getServiceLocalUrl(`/material/${material.id}`),
    })),
  );

  return {
    data: materialsWithUrls,
    metadata: materialsResult.metadata,
  };
}
