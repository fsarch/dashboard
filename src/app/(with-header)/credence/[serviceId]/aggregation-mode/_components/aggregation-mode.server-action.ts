'use server';

import { TPaginationParams, TPaginationResultDto, TAggregationModeDto, TAggregationModeCreateDto } from '@/services/credence/credence.type';
import { credenceService } from '@/services/credence/credence.service';

export async function loadAggregationModesAction(
  params: TPaginationParams,
  serviceId: string
): Promise<TPaginationResultDto<TAggregationModeDto>> {
  return credenceService.listAggregationModes(params, serviceId);
}

export async function createAggregationModeAction(
  dto: TAggregationModeCreateDto,
  serviceId: string
): Promise<TAggregationModeDto> {
  return credenceService.createAggregationMode(dto, serviceId);
}
