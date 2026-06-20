'use server';

import { watchtowerService } from '@/services/watchtower/watchtower.service';
import { TEventTypeCreateDto, TEventTypeDto, TPaginationParams, TPaginationResultDto } from '@/services/watchtower/watchtower.type';

export async function loadEventTypesAction(
  params: TPaginationParams,
  serviceId: string
): Promise<TPaginationResultDto<TEventTypeDto>> {
  return watchtowerService.listEventTypes(params, serviceId);
}

export async function createEventTypeAction(
  dto: TEventTypeCreateDto,
  serviceId: string
): Promise<void> {
  return watchtowerService.createEventType(dto, serviceId);
}
