'use server';

import { emailService } from "@/services/email/email.service";
import { useOpenDialog } from "@/components/universals/dialog/DialogProvider.context";

export async function syncEmailsAction(accountId: string) {
  try {
    await emailService.syncEmails(accountId);
    return {
      success: true,
      message: 'Emails erfolgreich synchronisiert',
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Synchronisierung fehlgeschlagen';
    return {
      success: false,
      message,
    };
  }
}

