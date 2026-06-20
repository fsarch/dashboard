'use server';

import { TPaginationParams, TPaginationResultDto, TAggregationModeDto, TAggregationModeCreateDto } from '@/services/watchtower/watchtower.type';
import { watchtowerService } from '@/services/watchtower/watchtower.service';

export async function loadAggregationModesAction(
  params: TPaginationParams,
  serviceId: string
): Promise<TPaginationResultDto<TAggregationModeDto>> {
  return watchtowerService.listAggregationModes(params, serviceId);
}

export async function createAggregationModeAction(
  dto: TAggregationModeCreateDto,
  serviceId: string
): Promise<TAggregationModeDto> {
  return watchtowerService.createAggregationMode(dto, serviceId);
}
