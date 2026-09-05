'use server';

import { revalidatePath } from 'next/cache';
import { functionService } from '@/services/function/function.service';

export async function activateVersionAction(
  serviceId: string,
  functionId: string,
  versionId: string,
): Promise<void> {
  await functionService.publishFunctionVersion(functionId, versionId);
  revalidatePath(`/function/${serviceId}/function/${functionId}/versions`);
}
