'use server';

import { functionGatewayService } from "@/services/function-gateway/function-gateway.service";
import { revalidatePath } from "next/cache";

export const executeFunctionAction = async (
  functionId: string,
  method: string = 'GET',
  input?: string
) => {
  try {
    const parsedInput = input ? JSON.parse(input) : undefined;
    const result = await functionGatewayService.executeFunction(functionId, {
      method: method as any,
      input: parsedInput,
    });

    return {
      success: true,
      result: JSON.stringify(result, null, 2),
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to execute function',
    };
  }
};
