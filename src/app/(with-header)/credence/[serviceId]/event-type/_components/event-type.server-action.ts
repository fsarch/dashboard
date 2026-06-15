'use server';

import { credenceService } from '@/services/credence/credence.service';
import { TEventTypeCreateDto, TEventTypeDto, TPaginationParams, TPaginationResultDto } from '@/services/credence/credence.type';

export async function loadEventTypesAction(
  params: TPaginationParams,
  serviceId: string
): Promise<TPaginationResultDto<TEventTypeDto>> {
  return credenceService.listEventTypes(params, serviceId);
}

export async function createEventTypeAction(
  dto: TEventTypeCreateDto,
  serviceId: string
): Promise<void> {
  return credenceService.createEventType(dto, serviceId);
}
