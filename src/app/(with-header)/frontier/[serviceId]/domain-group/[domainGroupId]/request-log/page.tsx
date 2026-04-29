import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import List from '@/components/universals/list/List';
import LinkListItem from '@/components/universals/list/LinkListItem';
import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
import { frontierService } from '@/services/frontier/frontier.service';
import { getServiceLocalUrl } from '@/utils/getServiceLocalUrl';
import { uacUtils } from '@/utils/uac.utils';
import DevResponseSection from '@/components/universals/section/DevResponseSection.component';

export const generateMetadata = createAutomaticMetadata();

export default async function RequestLogListPage({
  params,
}: {
  params: Promise<{ domainGroupId: string }>;
}) {
  const { domainGroupId } = await params;

  const [requestLogs, canSeeDevResponse] = await Promise.all([
    frontierService.listRequestLogs(domainGroupId, { limit: 100, offset: 0 }),
    uacUtils.hasPermission('dev'),
  ]);

  return (
    <DefaultPage>
      <Section name="Request Logs">
        {requestLogs.length === 0 ? (
          <p>Keine Request Logs gefunden.</p>
        ) : (
          <List>
            {requestLogs.map(async (log, index) => {
              const requestLogId = log.id ?? `__index-${index}`;
              const method = log.incomingMethod ?? '-';
              const url = log.incomingUrl ?? '-';
              const status = log.responseStatusCode !== undefined ? log.responseStatusCode : '-';
              const duration = log.requestTimeMs !== undefined ? `${log.requestTimeMs} ms` : '-';
              const timestamp = log.createdAt ? new Date(log.createdAt).toLocaleString('de-DE') : '-';

              return (
                <LinkListItem
                  key={requestLogId}
                  href={await getServiceLocalUrl(`/domain-group/${domainGroupId}/request-log/${requestLogId}`)}
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

