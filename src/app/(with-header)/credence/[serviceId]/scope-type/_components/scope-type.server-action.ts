'use server';

import { credenceService } from '@/services/credence/credence.service';
import { TScopeTypeCreateDto, TScopeTypeDto, TPaginationParams, TPaginationResultDto, TScopeDataTypeDto } from '@/services/credence/credence.type';

export async function loadScopeTypesAction(
  params: TPaginationParams,
  serviceId: string
): Promise<TPaginationResultDto<TScopeTypeDto>> {
  return credenceService.listScopeTypes(params, serviceId);
}

export async function loadScopeDataTypesAction(
  params: TPaginationParams,
  serviceId: string
): Promise<TPaginationResultDto<TScopeDataTypeDto>> {
  return credenceService.listScopeDataTypes(params, serviceId);
}

export async function createScopeTypeAction(
  dto: TScopeTypeCreateDto,
  serviceId: string
): Promise<void> {
  return credenceService.createScopeType(dto, serviceId);
}
