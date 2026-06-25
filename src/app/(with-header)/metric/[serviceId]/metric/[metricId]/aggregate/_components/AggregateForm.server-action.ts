'use server';

import { revalidatePath } from 'next/cache';
import { metricService } from '@/services/metric/metric.service';
import { TAggregateMeasurementsDto, TAggregateResult } from '@/services/metric/metric.type';

export type TAggregateFormState = {
  success?: boolean;
  error?: string;
  result?: TAggregateResult;
  aggregation?: string;
  interval?: string;
};

export async function aggregateMeasurementsAction(
  serviceId: string,
  metricId: string,
  prevState: TAggregateFormState,
  formData: FormData
): Promise<TAggregateFormState> {
  try {
    const startTime = formData.get('startTime') as string;
    const endTime = formData.get('endTime') as string;
    const interval = formData.get('interval') as string;
    const aggregation = formData.get('aggregation') as string;
    const warmTierOnly = formData.get('warmTierOnly') === 'on';

    if (!startTime || !endTime || !interval || !aggregation) {
      return {
        success: false,
        error: 'Bitte füllen Sie alle Pflichtfelder aus.',
      };
    }

    const dto: TAggregateMeasurementsDto = {
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      interval: interval as any,
      aggregation: aggregation as any,
      warmTierOnly,
    };

    const result = await metricService.aggregateMeasurements(
      metricId,
      dto,
      serviceId
    );

    return {
      success: true,
      result,
      aggregation,
      interval,
    };
  } catch (error) {
    console.error('Error aggregating measurements:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Ein unbekannter Fehler ist aufgetreten.',
    };
  }
}
