'use client';

import type React from 'react';
import type { EmailListItemWithUrl } from '@/app/(with-header)/email/[serviceId]/account/[accountId]/emails.server-action';
import Badge from '@/components/universals/badge/badge.component';
import LinkListItem from '@/components/universals/list/LinkListItem';
import List from '@/components/universals/list/List';
import PaginationFetcherComponent from '@/components/universals/pagination/PaginationFetcher.component';
import type { PaginationResultType } from '@/components/universals/pagination/PaginationFetcher.type';
import type { TPaginationResultDto } from '@/services/email/email.type';
import { datetimeUtils } from '@/utils/datetime.utils';

const PAGE_SIZE = 25;

type EmailsListProps = {
  className?: string;
  initialEmails: Array<EmailListItemWithUrl>;
  initialTotalItems: number;
  fetchEmails: (options: {
    skip: number;
    take: number;
    search?: string;
    sort?: string;
  }) => Promise<TPaginationResultDto<EmailListItemWithUrl>>;
  search?: string;
  sort?: string;
};

const EmailsList: React.FunctionComponent<EmailsListProps> = ({
  className,
  initialEmails,
  initialTotalItems,
  fetchEmails,
  search,
  sort,
}) => {
  const initialData: PaginationResultType<EmailListItemWithUrl> = {
    items: initialEmails,
    metadata: {
      currentPage: 1,
      pageSize: PAGE_SIZE,
      totalItems: initialTotalItems,
      totalPages: Math.max(1, Math.ceil(initialTotalItems / PAGE_SIZE)),
    },
  };

  const getData = async (options: {
    skip: number;
    take: number;
    search?: string;
    sort?: string;
  }): Promise<PaginationResultType<EmailListItemWithUrl>> => {
    const result = await fetchEmails(options);

    return {
      items: result.data,
      metadata: result.metadata,
    };
  };

  return (
    <PaginationFetcherComponent
      className={className}
      initialData={initialData}
      getData={getData}
      query={{ search, sort }}
      resetDependencies={[search, sort]}
      loadingText="E-Mails werden geladen..."
    >
      {(data) => (
        <List>
          {data.items.map((email) => (
            <LinkListItem
              key={email.id}
              href={email.url}
              right={
                email.creationTime ? (
                  <Badge>{datetimeUtils.formatDate(email.creationTime)}</Badge>
                ) : null
              }
            >
              {email.subject}
            </LinkListItem>
          ))}
        </List>
      )}
    </PaginationFetcherComponent>
  );
};

export default EmailsList;
