'use server';

import { credenceService } from '@/services/credence/credence.service';
import { TEventCreateDto, TEventDto, TEventTypeDto, TPaginationParams, TPaginationResultDto } from '@/services/credence/credence.type';

export async function loadEventTypesAction(
  params: TPaginationParams,
  serviceId: string
): Promise<TPaginationResultDto<TEventTypeDto>> {
  return credenceService.listEventTypes(params, serviceId);
}

export async function createEventAction(
  dto: TEventCreateDto,
  serviceId: string
): Promise<TEventDto> {
  return credenceService.createEvent(dto, serviceId);
}
