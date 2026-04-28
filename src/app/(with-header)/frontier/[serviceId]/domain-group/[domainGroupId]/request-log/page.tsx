import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import List from '@/components/universals/list/List';
import ListItem from '@/components/universals/list/ListItem';
import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
import { frontierService } from '@/services/frontier/frontier.service';
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
        <List>
          {requestLogs.map((log, index) => {
            const method = log.incomingMethod ?? '-';
            const url = log.incomingUrl ?? '-';
            const status = log.responseStatusCode !== undefined ? log.responseStatusCode : '-';
            const duration = log.requestTimeMs !== undefined ? `${log.requestTimeMs} ms` : '-';
            const timestamp = log.createdAt ? new Date(log.createdAt).toLocaleString('de-DE') : '-';

            return (
              <ListItem key={log.id ?? `${method}-${url}-${index}`}>
                [{timestamp}] {method} {url} {'->'} {status} ({duration})
              </ListItem>
            );
          })}
        </List>
      </Section>
      {canSeeDevResponse ? (
        <DevResponseSection title="Request Logs" response={requestLogs} />
      ) : null}
    </DefaultPage>
  );
}

