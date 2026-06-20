'use server';

import { watchtowerService } from '@/services/watchtower/watchtower.service';
import { TIpAsnDataCreateBodyDto, TIpAsnDataDto, TPaginationParams, TPaginationResultDto } from '@/services/watchtower/watchtower.type';

export async function loadIpAsnDataAction(
  datasourceId: string,
  params: TPaginationParams,
  serviceId: string
): Promise<TPaginationResultDto<TIpAsnDataDto>> {
  return watchtowerService.listIpAsnData(datasourceId, params, serviceId);
}

export async function createIpAsnDataAction(
  datasourceId: string,
  dto: TIpAsnDataCreateBodyDto,
  serviceId: string
): Promise<TIpAsnDataDto> {
  return watchtowerService.createIpAsnData(datasourceId, dto, serviceId);
}
