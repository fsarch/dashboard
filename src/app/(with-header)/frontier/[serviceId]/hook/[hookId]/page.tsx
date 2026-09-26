import GeneratedForm from '@/components/universals/forms/generated/GeneratedForm.component';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import DevResponseSection from '@/components/universals/section/DevResponseSection.component';
import Section from '@/components/universals/section/Section';
import { FRONTIER_HOOK_UPDATE_FORM } from '@/services/frontier/frontier.forms';
import { frontierService } from '@/services/frontier/frontier.service';
import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
import { getServiceLocalUrl } from '@/utils/getServiceLocalUrl';
import { uacUtils } from '@/utils/uac.utils';

export const generateMetadata = createAutomaticMetadata();

export default async function HookDetailPage({
  params,
}: {
  params: Promise<{ hookId: string }>;
}) {
  const { hookId } = await params;

  const [hook, canSeeDevResponse] = await Promise.all([
    frontierService.getHook(hookId),
    uacUtils.isDeveloper(),
  ]);

  if (!hook) {
    return (
      <DefaultPage>
        <Section name="Hook nicht gefunden">
          <p>Der angeforderte Hook existiert nicht.</p>
        </Section>
      </DefaultPage>
    );
  }

  return (
    <DefaultPage>
      <Section name={hook.name}>
        <GeneratedForm definition={FRONTIER_HOOK_UPDATE_FORM(hookId, hook)} />
      </Section>
      {canSeeDevResponse ? (
        <DevResponseSection title="Hook" response={hook} />
      ) : null}
    </DefaultPage>
  );
}
