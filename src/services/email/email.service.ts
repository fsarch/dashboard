import { fetchService } from "@/utils/fetchService";
import { AccountDto, EmailListDto, EmailSingleDto } from "@/services/email/email.type";

const listAccounts = async (): Promise<Array<AccountDto>> => {
  const response = await fetchService('/v1/accounts');
  const accounts = await response.json();

  return accounts;
};

const getAccount = async (accountId: string): Promise<AccountDto> => {
  const response = await fetchService(`/v1/accounts/${accountId}`);
  const account = await response.json();

  return account;
};

const listEmails = async (accountId: string): Promise<Array<EmailListDto>> => {
  const response = await fetchService(`/v1/accounts/${accountId}/emails`);
  const emails = await response.json();

  return emails;
};

const getEmail = async (accountId: string, emailId: string): Promise<EmailSingleDto> => {
  const response = await fetchService(`/v1/accounts/${accountId}/emails/${emailId}`);
  const email = await response.json();

  return email;
};

const syncEmails = async (accountId: string): Promise<void> => {
  const response = await fetchService(`/v1/accounts/${accountId}/sync`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to sync emails: ${response.statusText}`);
  }
};

export const emailService = {
  listAccounts,
  getAccount,
  listEmails,
  getEmail,
  syncEmails,
};

