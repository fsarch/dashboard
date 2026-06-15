'use server';

import { credenceService } from '@/services/credence/credence.service';
import { TIpAsnDatasourceCreateDto, TIpAsnDatasourceDto, TPaginationParams, TPaginationResultDto } from '@/services/credence/credence.type';

export async function loadIpAsnDatasourcesAction(
  params: TPaginationParams,
  serviceId: string
): Promise<TPaginationResultDto<TIpAsnDatasourceDto>> {
  return credenceService.listIpAsnDatasources(params, serviceId);
}

export async function createIpAsnDatasourceAction(
  dto: TIpAsnDatasourceCreateDto,
  serviceId: string
): Promise<TIpAsnDatasourceDto> {
  return credenceService.createIpAsnDatasource(dto, serviceId);
}
