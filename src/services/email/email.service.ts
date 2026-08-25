import { fetchService } from "@/utils/fetchService";
import {
  AccountDto,
  EmailListDto,
  EmailListParams,
  EmailListResponseDto,
  EmailSingleDto,
  TPaginationResultDto,
} from "@/services/email/email.type";

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

const listEmails = async (
  accountId: string,
  options?: EmailListParams,
): Promise<TPaginationResultDto<EmailListDto>> => {
  const url = new URL(`/v1/accounts/${accountId}/emails`, 'http://localhost'); // Base URL will be replaced by fetchService

  if (options?.page !== undefined) url.searchParams.append('page', options.page.toString());
  if (options?.limit !== undefined) url.searchParams.append('limit', options.limit.toString());
  if (options?.search) url.searchParams.append('search', options.search);
  if (options?.sort) url.searchParams.append('sort', options.sort);

  const response = await fetchService(url.pathname + url.search);
  const result: EmailListResponseDto = await response.json();

  const { total, page, limit } = result.meta;

  return {
    data: result.items,
    metadata: {
      currentPage: page,
      pageSize: limit,
      totalItems: total,
      totalPages: limit > 0 ? Math.max(1, Math.ceil(total / limit)) : 1,
    },
  };
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

