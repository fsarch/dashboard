'use server';

import { TPaginationParams, TPaginationResultDto, TAggregationModeTypeDto } from '@/services/credence/credence.type';
import { credenceService } from '@/services/credence/credence.service';

export async function loadAggregationModeTypesAction(
  params: TPaginationParams,
  serviceId: string
): Promise<TPaginationResultDto<TAggregationModeTypeDto>> {
  return credenceService.listAggregationModeTypes(params, serviceId);
}
