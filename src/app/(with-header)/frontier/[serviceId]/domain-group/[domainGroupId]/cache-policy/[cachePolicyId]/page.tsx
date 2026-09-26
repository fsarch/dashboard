import GeneratedForm from '@/components/universals/forms/generated/GeneratedForm.component';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import DevResponseSection from '@/components/universals/section/DevResponseSection.component';
import Section from '@/components/universals/section/Section';
import { FRONTIER_CACHE_POLICY_UPDATE_FORM } from '@/services/frontier/frontier.forms';
import { frontierService } from '@/services/frontier/frontier.service';
import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
import { uacUtils } from '@/utils/uac.utils';

export const generateMetadata = createAutomaticMetadata();

export default async function CachePolicyDetailPage({
  params,
}: {
  params: Promise<{ domainGroupId: string; cachePolicyId: string }>;
}) {
  const { domainGroupId, cachePolicyId } = await params;

  const [policy, canSeeDevResponse] = await Promise.all([
    frontierService.getCachePolicy(domainGroupId, cachePolicyId),
    uacUtils.isDeveloper(),
  ]);

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
        <GeneratedForm
          definition={FRONTIER_CACHE_POLICY_UPDATE_FORM(
            domainGroupId,
            cachePolicyId,
            policy,
          )}
        />
      </Section>
      {canSeeDevResponse ? (
        <DevResponseSection title="Cache Policy" response={policy} />
      ) : null}
    </DefaultPage>
  );
}
