import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
import { getAccessToken } from '@/utils/getAccessToken';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { uacUtils } from '@/utils/uac.utils';
import { getServiceConfigurationById } from '@/utils/configuration.utils';
import { EServiceType } from '@/utils/configuration.type';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import Link from 'next/link';
import { getServiceLocalUrl } from '@/utils/getServiceLocalUrl';
import { functionService } from '@/services/function/function.service';
import { ExecutionDto, LogDto } from '@/services/function/function.type';

export const generateMetadata = createAutomaticMetadata();

type ExecutionDetailPageProps = {
  params: Promise<{ serviceId: string; functionId: string; executionId: string }>;
};

export default async function ExecutionDetailPage({ params }: ExecutionDetailPageProps) {
  const { serviceId, functionId, executionId } = await params;

  const accessToken = await getAccessToken();

  if (!accessToken) {
    const callbackUrl = (await headers()).get('X-Original-URL') || '/';
    return redirect(`/api/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  const service = await getServiceConfigurationById(serviceId);
  if (!service) {
    return notFound();
  }

  const canAccessService = await uacUtils.hasAppPermission(
    EServiceType.FUNCTION,
    serviceId,
    accessToken
  );
  if (!canAccessService) {
    return notFound();
  }

  const execution = await functionService.getExecution(executionId);
  const logs = await functionService.listExecutionLogs(executionId);

  if (!execution) {
    return notFound();
  }

  return (
    <DefaultPage>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <Link
          href={await getServiceLocalUrl(`/function/${functionId}/executions`)}
          style={{ padding: '0.5rem 1rem', textDecoration: 'none', background: 'var(--color-background)', borderRadius: '4px' }}
        >
          Zurück zu Executions
        </Link>
      </div>
      
      <Section name="Execution Details">
        <div>
          <p><strong>ID:</strong> {execution.id}</p>
          <p><strong>Function ID:</strong> {execution.functionId}</p>
          <p><strong>Status:</strong> {execution.isSuccess ? '✓ Success' : '✗ Failed'}</p>
          <p><strong>Created:</strong> {new Date(execution.creationTime).toLocaleString()}</p>
          {execution.deletionTime && (
            <p><strong>Deleted:</strong> {new Date(execution.deletionTime).toLocaleString()}</p>
          )}
          
          {execution.arguments && (
            <div style={{ marginTop: '1rem' }}>
              <strong>Arguments:</strong>
              <pre style={{ background: 'var(--color-background)', padding: '0.5rem', borderRadius: '4px', marginTop: '0.5rem' }}>
                {JSON.stringify(execution.arguments, null, 2)}
              </pre>
            </div>
          )}
          
          {execution.response && (
            <div style={{ marginTop: '1rem' }}>
              <strong>Response:</strong>
              <pre style={{ background: 'var(--color-background)', padding: '0.5rem', borderRadius: '4px', marginTop: '0.5rem' }}>
                {JSON.stringify(execution.response, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </Section>
      
      <Section name="Logs">
        {logs.length > 0 ? (
          <div style={{ border: '1px solid var(--color-border)', borderRadius: '8px', padding: '1rem' }}>
            {logs.map((log: LogDto) => (
              <div key={log.id} style={{ 
                padding: '0.5rem 0', 
                borderBottom: '1px solid var(--color-border)',
                marginBottom: '0.5rem'
              }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>
                    {new Date(log.creationTime).toLocaleString()}
                  </span>
                  <span style={{ 
                    color: getLogLevelColor(log.logLevelId), 
                    fontWeight: 'bold'
                  }}>
                    Level {log.logLevelId}
                  </span>
                </div>
                <div style={{ marginLeft: '2rem', marginTop: '0.25rem' }}>
                  <p>{log.message}</p>
                  {log.data && (
                    <pre style={{ background: 'var(--color-background)', padding: '0.5rem', borderRadius: '4px', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                      {JSON.stringify(log.data, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Keine Logs für diese Execution gefunden.</p>
        )}
      </Section>
    </DefaultPage>
  );
}

function getLogLevelColor(logLevelId: number): string {
  switch (logLevelId) {
    case 1: // Trace
      return '#6c757d';
    case 2: // Debug
      return '#0d6efd';
    case 3: // Info
      return '#0dcaf0';
    case 4: // Warning
      return '#ffc107';
    case 5: // Error
      return '#dc3545';
    case 6: // Critical
      return '#6f42c1';
    default:
      return 'inherit';
  }
}
