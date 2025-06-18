'use server';

import { functionService } from "@/services/function/function.service";

export async function saveCode(functionId: string, code: string) {
  await functionService.setFunctionVersionCode(functionId, code);
}

export async function publishCode(functionId: string) {
  await functionService.publishFunctionCode(functionId);
}
