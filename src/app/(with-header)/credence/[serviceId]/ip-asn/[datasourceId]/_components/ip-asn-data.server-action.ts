'use server';

import { credenceService } from '@/services/credence/credence.service';
import { TIpAsnDataCreateBodyDto, TIpAsnDataDto, TPaginationParams, TPaginationResultDto } from '@/services/credence/credence.type';

export async function loadIpAsnDataAction(
  datasourceId: string,
  params: TPaginationParams,
  serviceId: string
): Promise<TPaginationResultDto<TIpAsnDataDto>> {
  return credenceService.listIpAsnData(datasourceId, params, serviceId);
}

export async function createIpAsnDataAction(
  datasourceId: string,
  dto: TIpAsnDataCreateBodyDto,
  serviceId: string
): Promise<TIpAsnDataDto> {
  return credenceService.createIpAsnData(datasourceId, dto, serviceId);
}
