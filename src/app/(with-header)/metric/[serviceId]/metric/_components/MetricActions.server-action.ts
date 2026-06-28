'use server';

import { revalidatePath } from 'next/cache';
import { metricService } from '@/services/metric/metric.service';

export async function deleteMetricAction(
  serviceId: string,
  metricId: string
): Promise<void> {
  await metricService.deleteMetric(metricId, serviceId);
  revalidatePath(`/metric/${serviceId}/metric`);
}

export async function restoreMetricAction(
  serviceId: string,
  metricId: string
): Promise<void> {
  await metricService.restoreMetric(metricId, serviceId);
  revalidatePath(`/metric/${serviceId}/metric`);
}
