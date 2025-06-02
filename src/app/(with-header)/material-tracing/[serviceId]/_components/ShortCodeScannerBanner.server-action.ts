'use server';

import { shortCodeService } from "@/services/material-tracing/short-code.service";
import { EShortCodeType, TShortCode } from "@/services/material-tracing/short-code.type";
import { materialService } from "@/services/material-tracing/material.service";
import { TMaterial } from "@/services/material-tracing/material.type";
import { TPart } from "@/services/material-tracing/part.type";
import { partService } from "@/services/material-tracing/part.service";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";

type TShortCodeResponse = {
  type: EShortCodeType.MATERIAL,
  value: TMaterial;
  url: string;
} | {
  type: EShortCodeType.PART,
  value: TPart;
  url: string;
} | {
  type: 'unconnected';
  value: TShortCode;
  url: string;
}

export async function analyzeShortCode(shortCode: string): Promise<TShortCodeResponse> {
  const shortCodeRes = await shortCodeService.getShortCode(shortCode);

  if (shortCodeRes.shortCodeTypeId === EShortCodeType.MATERIAL) {
    const materials = await materialService.listMaterialsByShortCode(shortCode);

    return {
      type: EShortCodeType.MATERIAL,
      value: materials[0],
      url: await getServiceLocalUrl(`/material/${materials[0].id}`),
    };
  }

  if (shortCodeRes.shortCodeTypeId === EShortCodeType.PART) {
    const parts = await partService.listPartsByShortCode(shortCode);

    return {
      type: EShortCodeType.PART,
      value: parts[0],
      url: await getServiceLocalUrl(`/part/${parts[0].id}`),
    };
  }

  return {
    type: 'unconnected',
    value: shortCodeRes,
    url: await getServiceLocalUrl(`/short-code/${shortCodeRes.id}`),
  };
}
