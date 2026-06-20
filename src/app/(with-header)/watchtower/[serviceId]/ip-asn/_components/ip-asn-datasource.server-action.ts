'use server';

import { watchtowerService } from '@/services/watchtower/watchtower.service';
import { TIpAsnDatasourceCreateDto, TIpAsnDatasourceDto, TPaginationParams, TPaginationResultDto } from '@/services/watchtower/watchtower.type';

export async function loadIpAsnDatasourcesAction(
  params: TPaginationParams,
  serviceId: string
): Promise<TPaginationResultDto<TIpAsnDatasourceDto>> {
  return watchtowerService.listIpAsnDatasources(params, serviceId);
}

export async function createIpAsnDatasourceAction(
  dto: TIpAsnDatasourceCreateDto,
  serviceId: string
): Promise<TIpAsnDatasourceDto> {
  return watchtowerService.createIpAsnDatasource(dto, serviceId);
}
