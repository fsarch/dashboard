import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import List from '@/components/universals/list/List';
import LinkListItem from '@/components/universals/list/LinkListItem';
import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
import { frontierService } from '@/services/frontier/frontier.service';
import { getServiceLocalUrl } from '@/utils/getServiceLocalUrl';
import { uacUtils } from '@/utils/uac.utils';
import DevResponseSection from '@/components/universals/section/DevResponseSection.component';
import Link from 'next/link';
import Button from '@/components/universals/forms/Button';

export const generateMetadata = createAutomaticMetadata();

export default async function RequestLogListPage({
  params,
  searchParams,
}: {
  params: Promise<{ domainGroupId: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { domainGroupId } = await params;
  const resolvedSearchParams = await searchParams;

  const page = Math.max(parseInt(resolvedSearchParams.page ?? '1', 10) || 1, 1);
  const pageSizeRaw = parseInt(resolvedSearchParams.pageSize ?? '25', 10) || 25;
  const pageSize = Math.min(Math.max(pageSizeRaw, 1), 100);
  const offset = (page - 1) * pageSize;

  const baseLogPath = await getServiceLocalUrl(`/domain-group/${domainGroupId}/request-log`);
  const createPageHref = (targetPage: number) => {
    const query = new URLSearchParams({
      page: `${targetPage}`,
      pageSize: `${pageSize}`,
    });

    return `${baseLogPath}?${query.toString()}`;
  };

  const [requestLogsWithSentinel, canSeeDevResponse] = await Promise.all([
    frontierService.listRequestLogs(domainGroupId, { limit: pageSize + 1, offset }),
    uacUtils.hasPermission('dev'),
  ]);

  const hasNextPage = requestLogsWithSentinel.length > pageSize;
  const requestLogs = hasNextPage ? requestLogsWithSentinel.slice(0, pageSize) : requestLogsWithSentinel;

  return (
    <DefaultPage>
      <Section name="Request Logs">
        <div style={{ marginBottom: '12px', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span>Seite {page}</span>
          {page > 1 ? (
            <Link href={createPageHref(page - 1)}>
              <Button type="button">Zurueck</Button>
            </Link>
          ) : null}
          {hasNextPage ? (
            <Link href={createPageHref(page + 1)}>
              <Button type="button">Weiter</Button>
            </Link>
          ) : null}
        </div>
        {requestLogs.length === 0 ? (
          <p>Keine Request Logs gefunden.</p>
        ) : (
          <List>
            {requestLogs.map(async (log, index) => {
              const requestLogId = log.id ?? `__absolute-${offset + index}`;
              const method = log.incomingMethod ?? '-';
              const url = log.incomingUrl ?? '-';
              const status = log.responseStatusCode !== undefined ? log.responseStatusCode : '-';
              const duration = log.requestTimeMs !== undefined ? `${log.requestTimeMs} ms` : '-';
              const timestamp = log.createdAt ? new Date(log.createdAt).toLocaleString('de-DE') : '-';

              return (
                <LinkListItem
                  key={requestLogId}
                  href={`${await getServiceLocalUrl(`/domain-group/${domainGroupId}/request-log/${requestLogId}`)}?${new URLSearchParams({
                    page: `${page}`,
                    pageSize: `${pageSize}`,
                  }).toString()}`}
                >
                  [{timestamp}] {method} {url} {'->'} {status} ({duration})
                </LinkListItem>
              );
            })}
          </List>
        )}
      </Section>
      {canSeeDevResponse ? (
        <DevResponseSection title="Request Logs" response={requestLogs} />
      ) : null}
    </DefaultPage>
  );
}

