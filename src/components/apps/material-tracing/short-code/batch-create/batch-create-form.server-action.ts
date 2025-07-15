'use server';

import { shortCodeService } from "@/services/material-tracing/short-code.service";
import { generateQrCode } from "@/components/universals/qr-code/QRCode.utils";
import { TShortCode } from "@/services/material-tracing/short-code.type";

export const batchCreateShortCodes = async (amount: number): Promise<{
  success: true;
  base64: string;
  shortCodes: TShortCode[];
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
    const createdShortCodes = await shortCodeService.batchCreateShortCodes(amount);
    
    // Extract the codes for QR generation
    const codes = createdShortCodes.map(shortCode => shortCode.code);
    
    // Generate PDF with QR codes
    const response = await generateQrCode({
      values: codes,
    });

    return {
      success: true,
      base64: response.base64,
      shortCodes: createdShortCodes,
    };
  } catch (error) {
    console.error('Error creating short codes:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};