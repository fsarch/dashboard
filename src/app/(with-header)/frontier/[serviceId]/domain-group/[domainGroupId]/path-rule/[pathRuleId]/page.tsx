import GeneratedForm from '@/components/universals/forms/generated/GeneratedForm.component';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import DevResponseSection from '@/components/universals/section/DevResponseSection.component';
import Section from '@/components/universals/section/Section';
import { FRONTIER_PATH_RULE_UPDATE_FORM } from '@/services/frontier/frontier.forms';
import { frontierService } from '@/services/frontier/frontier.service';
import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
import { uacUtils } from '@/utils/uac.utils';

export const generateMetadata = createAutomaticMetadata();

export default async function PathRuleDetailPage({
  params,
}: {
  params: Promise<{ domainGroupId: string; pathRuleId: string }>;
}) {
  const { domainGroupId, pathRuleId } = await params;

  const [pathRule, canSeeDevResponse] = await Promise.all([
    frontierService.getPathRule(domainGroupId, pathRuleId),
    uacUtils.isDeveloper(),
  ]);

  if (!pathRule) {
    return (
      <DefaultPage>
        <Section name="Path Rule">
          <p>Path Rule nicht gefunden.</p>
        </Section>
      </DefaultPage>
    );
  }

  return (
    <DefaultPage>
      <Section name={`Path Rule: ${pathRule.name}`}>
        <GeneratedForm
          definition={FRONTIER_PATH_RULE_UPDATE_FORM(
            domainGroupId,
            pathRuleId,
            pathRule,
          )}
        />
      </Section>
      {canSeeDevResponse ? (
        <DevResponseSection title="Path Rule" response={pathRule} />
      ) : null}
    </DefaultPage>
  );
}
