'use server';

import { watchtowerService } from '@/services/watchtower/watchtower.service';
import { TScopeTypeCreateDto, TScopeTypeDto, TPaginationParams, TPaginationResultDto, TScopeDataTypeDto } from '@/services/watchtower/watchtower.type';

export async function loadScopeTypesAction(
  params: TPaginationParams,
  serviceId: string
): Promise<TPaginationResultDto<TScopeTypeDto>> {
  return watchtowerService.listScopeTypes(params, serviceId);
}

export async function loadScopeDataTypesAction(
  params: TPaginationParams,
  serviceId: string
): Promise<TPaginationResultDto<TScopeDataTypeDto>> {
  return watchtowerService.listScopeDataTypes(params, serviceId);
}

export async function createScopeTypeAction(
  dto: TScopeTypeCreateDto,
  serviceId: string
): Promise<void> {
  return watchtowerService.createScopeType(dto, serviceId);
}
