'use server';

import { watchtowerService } from '@/services/watchtower/watchtower.service';
import { TEventCreateDto, TEventDto, TEventTypeDto, TPaginationParams, TPaginationResultDto } from '@/services/watchtower/watchtower.type';

export async function loadEventTypesAction(
  params: TPaginationParams,
  serviceId: string
): Promise<TPaginationResultDto<TEventTypeDto>> {
  return watchtowerService.listEventTypes(params, serviceId);
}

export async function createEventAction(
  dto: TEventCreateDto,
  serviceId: string
): Promise<TEventDto> {
  return watchtowerService.createEvent(dto, serviceId);
}
