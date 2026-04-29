import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
import { frontierService } from '@/services/frontier/frontier.service';
import { RequestLogDto } from '@/services/frontier/frontier.type';
import { getServiceLocalUrl } from '@/utils/getServiceLocalUrl';
import { uacUtils } from '@/utils/uac.utils';
import DevResponseSection from '@/components/universals/section/DevResponseSection.component';
import Link from 'next/link';
import Button from '@/components/universals/forms/Button';

export const generateMetadata = createAutomaticMetadata();

function renderHeaderObject(title: string, value: RequestLogDto['incomingHeaders']) {
  if (!value || Object.keys(value).length === 0) {
    return (
      <div>
        <strong>{title}:</strong> -
      </div>
    );
  }

  return (
    <details style={{ marginTop: '8px' }}>
      <summary>{title}</summary>
      <pre style={{ whiteSpace: 'pre-wrap', overflowX: 'auto', marginTop: '8px' }}>
        {JSON.stringify(value, null, 2)}
      </pre>
    </details>
  );
}

export default async function RequestLogDetailPage({
  params,
}: {
  params: Promise<{ domainGroupId: string; requestLogId: string }>;
}) {
  const { domainGroupId, requestLogId } = await params;

  const [requestLog, backLink, canSeeDevResponse] = await Promise.all([
    frontierService.getRequestLog(domainGroupId, requestLogId),
    getServiceLocalUrl(`/domain-group/${domainGroupId}/request-log`),
    uacUtils.hasPermission('dev'),
  ]);

  if (!requestLog) {
    return (
      <DefaultPage>
        <Section name="Request Log">
          <p>Request Log nicht gefunden.</p>
        </Section>
      </DefaultPage>
    );
  }

  const status = requestLog.responseStatusCode !== undefined ? requestLog.responseStatusCode : '-';
  const duration = requestLog.requestTimeMs !== undefined ? `${requestLog.requestTimeMs} ms` : '-';
  const timestamp = requestLog.createdAt ? new Date(requestLog.createdAt).toLocaleString('de-DE') : '-';
  const title = `${requestLog.incomingMethod ?? '-'} ${requestLog.incomingUrl ?? '-'}`;

  return (
    <DefaultPage>
      <Section name={`Request Log: ${title}`}>
        <div style={{ marginBottom: '12px' }}>
          <Link href={backLink}>
            <Button type="button">Zurück zur Log-Liste</Button>
          </Link>
        </div>
        <div style={{ display: 'grid', gap: '8px' }}>
          <div><strong>ID:</strong> {requestLog.id ?? '-'}</div>
          <div><strong>Domain Group:</strong> {requestLog.domainGroupId ?? domainGroupId}</div>
          <div><strong>Path Rule:</strong> {requestLog.pathRuleId ?? '-'}</div>
          <div><strong>Log Policy:</strong> {requestLog.logPolicyId ?? '-'}</div>
          <div><strong>Incoming Method:</strong> {requestLog.incomingMethod ?? '-'}</div>
          <div><strong>Incoming URL:</strong> {requestLog.incomingUrl ?? '-'}</div>
          <div><strong>Upstream Method:</strong> {requestLog.upstreamMethod ?? '-'}</div>
          <div><strong>Upstream URL:</strong> {requestLog.upstreamUrl ?? '-'}</div>
          <div><strong>Status:</strong> {status}</div>
          <div><strong>Dauer:</strong> {duration}</div>
          <div><strong>Zeitpunkt:</strong> {timestamp}</div>
          {renderHeaderObject('Incoming Headers', requestLog.incomingHeaders)}
          {renderHeaderObject('Upstream Headers', requestLog.upstreamHeaders)}
          <details style={{ marginTop: '8px' }}>
            <summary>Raw JSON</summary>
            <pre style={{ whiteSpace: 'pre-wrap', overflowX: 'auto', marginTop: '8px' }}>
              {JSON.stringify(requestLog, null, 2)}
            </pre>
          </details>
        </div>
      </Section>
      {canSeeDevResponse ? (
        <DevResponseSection title="Request Log" response={requestLog} />
      ) : null}
    </DefaultPage>
  );
}

