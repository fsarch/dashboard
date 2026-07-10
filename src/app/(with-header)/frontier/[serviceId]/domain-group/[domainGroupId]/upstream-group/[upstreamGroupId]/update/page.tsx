import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
import GeneratedForm from '@/components/universals/forms/generated/GeneratedForm.component';
import { FRONTIER_UPSTREAM_GROUP_UPDATE_FORM } from '@/services/frontier/frontier.forms';
import { frontierService } from '@/services/frontier/frontier.service';

export const generateMetadata = createAutomaticMetadata();

export default async function UpdateUpstreamGroupPage({
  params,
}: {
  params: Promise<{ serviceId: string; domainGroupId: string; upstreamGroupId: string }>;
}) {
  const { domainGroupId, upstreamGroupId } = await params;

  const upstreamGroup = await frontierService.getUpstreamGroupById(domainGroupId, upstreamGroupId);

  if (!upstreamGroup) {
    return (
      <DefaultPage>
        <Section name="Upstream Group aktualisieren">
          <p>Upstream Group nicht gefunden.</p>
        </Section>
      </DefaultPage>
    );
  }

  return (
    <DefaultPage>
      <Section name="Upstream Group aktualisieren">
        <GeneratedForm definition={FRONTIER_UPSTREAM_GROUP_UPDATE_FORM(domainGroupId, upstreamGroupId, upstreamGroup)} />
      </Section>
    </DefaultPage>
  );
}
