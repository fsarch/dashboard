import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
import { frontierService } from '@/services/frontier/frontier.service';

export const generateMetadata = createAutomaticMetadata();

export default async function CachePolicyDetailPage({
  params,
}: {
  params: Promise<{ domainGroupId: string; cachePolicyId: string }>;
}) {
  const { domainGroupId, cachePolicyId } = await params;

  const cachePolicies = await frontierService.listCachePolicies(domainGroupId);
  const policy = cachePolicies.find((p) => p.id === cachePolicyId);

  if (!policy) {
    return (
      <DefaultPage>
        <Section name="Cache Policy">
          <p>Cache Policy nicht gefunden.</p>
        </Section>
      </DefaultPage>
    );
  }

  return (
    <DefaultPage>
      <Section name={`Cache Policy: ${policy.name}`}>
        <p><strong>Name:</strong> {policy.name}</p>
        <p><strong>Cache-Tags aktiv:</strong> {policy.enableCacheTags ? 'Ja' : 'Nein'}</p>
        {policy.enableCacheTags && (
          <p><strong>Cache-Tags Header:</strong> {policy.cacheTagsHeader}</p>
        )}
        <p><strong>Standard-TTL:</strong> {policy.defaultTTL}s</p>
        <p><strong>Min-TTL:</strong> {policy.minTTL}s</p>
        <p><strong>Max-TTL:</strong> {policy.maxTTL}s</p>
        <p><strong>Stale While Error:</strong> {policy.enableStaleWhileError ? `Ja (${policy.staleWhileErrorTime}s)` : 'Nein'}</p>
        <p><strong>Stale While Revalidate:</strong> {policy.enableStaleWhileRevalidate ? `Ja (${policy.staleWhileRevalidateTime}s)` : 'Nein'}</p>
        {policy.divergenceCookies.length > 0 && (
          <p><strong>Divergence Cookies:</strong> {policy.divergenceCookies.join(', ')}</p>
        )}
        {policy.divergenceHeaders.length > 0 && (
          <p><strong>Divergence Headers:</strong> {policy.divergenceHeaders.join(', ')}</p>
        )}
        {policy.divergenceQueryParameters.length > 0 && (
          <p><strong>Divergence Query Params:</strong> {policy.divergenceQueryParameters.join(', ')}</p>
        )}
      </Section>
    </DefaultPage>
  );
}

