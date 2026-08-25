'use server';

import { emailService } from "@/services/email/email.service";
import { EmailListDto, TPaginationResultDto } from "@/services/email/email.type";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";

export type EmailListItemWithUrl = EmailListDto & {
  url: string;
};

export async function loadPaginatedEmailsAction(
  accountId: string,
  options?: {
    skip?: number;
    take?: number;
    search?: string;
    sort?: string;
  },
): Promise<TPaginationResultDto<EmailListItemWithUrl>> {
  const limit = options?.take ?? 25;
  const page = options?.skip !== undefined ? Math.floor(options.skip / limit) + 1 : 1;

  const emailsResult = await emailService.listEmails(accountId, {
    page,
    limit,
    search: options?.search,
    sort: options?.sort,
  });

  const emailsWithUrls = await Promise.all(
    emailsResult.data.map(async (email) => ({
      ...email,
      url: await getServiceLocalUrl(`/account/${accountId}/email/${email.id}`),
    })),
  );

  return {
    data: emailsWithUrls,
    metadata: emailsResult.metadata,
  };
}
