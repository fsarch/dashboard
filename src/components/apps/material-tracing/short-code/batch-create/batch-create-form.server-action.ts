'use server';

import { shortCodeService } from "@/services/material-tracing/short-code.service";
import { generateQrCode } from "@/components/universals/qr-code/QRCode.utils";
import { TShortCode } from "@/services/material-tracing/short-code.type";

export const batchCreateShortCodes = async (amount: number): Promise<{
  success: true;
  base64: string;
  shortCodes: TShortCode[];
  failedCount: number;
  errors: Array<string>;
} | {
  success: false;
  error: string;
}> => {
  if (!amount || amount < 1 || amount > 100) {
    return {
      success: false,
      error: 'Amount must be between 1 and 100'
    };
  }

  try {
    // Create the short codes
    const result = await shortCodeService.batchCreateShortCodes(amount);
    
    // If no short codes were created successfully, return an error
    if (result.shortCodes.length === 0) {
      return {
        success: false,
        error: `Failed to create any short codes. Errors: ${result.errors.join(', ')}`
      };
    }
    
    // Extract the codes for QR generation
    const codes = result.shortCodes.map(shortCode => shortCode.code);
    
    // Generate PDF with QR codes
    const response = await generateQrCode({
      values: codes,
    });

    return {
      success: true,
      base64: response.base64,
      shortCodes: result.shortCodes,
      failedCount: result.failedCount,
      errors: result.errors,
    };
  } catch (error) {
    console.error('Error creating short codes:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};