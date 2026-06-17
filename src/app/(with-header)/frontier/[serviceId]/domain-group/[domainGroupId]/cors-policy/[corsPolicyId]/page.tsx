import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
import { frontierService } from '@/services/frontier/frontier.service';
import GeneratedForm from '@/components/universals/forms/generated/GeneratedForm.component';
import { FRONTIER_CORS_POLICY_UPDATE_FORM } from '@/services/frontier/frontier.forms';
import { uacUtils } from '@/utils/uac.utils';
import DevResponseSection from '@/components/universals/section/DevResponseSection.component';

export const generateMetadata = createAutomaticMetadata();

export default async function CorsPolicyDetailPage({
  params,
}: {
  params: Promise<{ domainGroupId: string; corsPolicyId: string }>;
}) {
  const { domainGroupId, corsPolicyId } = await params;

  const [corsPolicy, canSeeDevResponse] = await Promise.all([
    frontierService.getCorsPolicy(domainGroupId, corsPolicyId),
    uacUtils.isDeveloper(),
  ]);

  if (!corsPolicy) {
    return (
      <DefaultPage>
        <Section name="CORS Policy">
          <p>CORS Policy nicht gefunden.</p>
        </Section>
      </DefaultPage>
    );
  }

  return (
    <DefaultPage>
      <Section name={`CORS Policy: ${corsPolicy.name}`}>
        <GeneratedForm definition={FRONTIER_CORS_POLICY_UPDATE_FORM(domainGroupId, corsPolicyId, corsPolicy)} />
      </Section>
      {canSeeDevResponse ? (
        <DevResponseSection title="CORS Policy" response={corsPolicy} />
      ) : null}
    </DefaultPage>
  );
}

