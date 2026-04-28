import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
import { frontierService } from '@/services/frontier/frontier.service';
import GeneratedForm from '@/components/universals/forms/generated/GeneratedForm.component';
import { FRONTIER_LOG_POLICY_UPDATE_FORM } from '@/services/frontier/frontier.forms';
import { uacUtils } from '@/utils/uac.utils';
import DevResponseSection from '@/components/universals/section/DevResponseSection.component';

export const generateMetadata = createAutomaticMetadata();

export default async function LogPolicyDetailPage({
  params,
}: {
  params: Promise<{ domainGroupId: string; logPolicyId: string }>;
}) {
  const { domainGroupId, logPolicyId } = await params;

  const [logPolicy, canSeeDevResponse] = await Promise.all([
    frontierService.getLogPolicy(domainGroupId, logPolicyId),
    uacUtils.hasPermission('dev'),
  ]);

  if (!logPolicy) {
    return (
      <DefaultPage>
        <Section name="Log Policy">
          <p>Log Policy nicht gefunden.</p>
        </Section>
      </DefaultPage>
    );
  }

  return (
    <DefaultPage>
      <Section name={`Log Policy: ${logPolicy.name}`}>
        <GeneratedForm definition={FRONTIER_LOG_POLICY_UPDATE_FORM(domainGroupId, logPolicyId, logPolicy)} />
      </Section>
      {canSeeDevResponse ? (
        <DevResponseSection title="Log Policy" response={logPolicy} />
      ) : null}
    </DefaultPage>
  );
}

