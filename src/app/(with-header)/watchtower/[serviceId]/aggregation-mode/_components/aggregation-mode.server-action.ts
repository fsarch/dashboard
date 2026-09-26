'use server';

import { watchtowerService } from '@/services/watchtower/watchtower.service';
import type {
  TAggregationModeCreateDto,
  TAggregationModeDto,
  TPaginationParams,
  TPaginationResultDto,
} from '@/services/watchtower/watchtower.type';

export async function loadAggregationModesAction(
  params: TPaginationParams,
  serviceId: string,
): Promise<TPaginationResultDto<TAggregationModeDto>> {
  return watchtowerService.listAggregationModes(params, serviceId);
}

export async function createAggregationModeAction(
  dto: TAggregationModeCreateDto,
  serviceId: string,
): Promise<TAggregationModeDto> {
  return watchtowerService.createAggregationMode(dto, serviceId);
}
