'use server';

import { materialService } from "@/services/material-tracing/material.service";
import { partService } from "@/services/material-tracing/part.service";

export type ConnectPartMaterialShortCode = {
  shortCode: string;
};

export const connectPartMaterialShortCode = async ({ value, partId }: { partId: string; value: ConnectPartMaterialShortCode }) => {
  const materials = await materialService.listMaterialsByShortCode(value.shortCode);

  await Promise.all(materials.map(async (material) => {
    await partService.getOrCreateMaterial(partId, material.id);
  }));

  console.log('shortCodes', partId, materials);
};
