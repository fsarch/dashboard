import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
import GeneratedForm from '@/components/universals/forms/generated/GeneratedForm.component';
import { FRONTIER_UPSTREAM_UPDATE_FORM } from '@/services/frontier/frontier.forms';
import { frontierService } from '@/services/frontier/frontier.service';

export const generateMetadata = createAutomaticMetadata();

export default async function UpdateUpstreamPage({
  params,
}: {
  params: Promise<{ serviceId: string; domainGroupId: string; upstreamGroupId: string; upstreamId: string }>;
}) {
  const { domainGroupId, upstreamGroupId, upstreamId } = await params;

  const upstream = await frontierService.getUpstreamById(domainGroupId, upstreamGroupId, upstreamId);

  if (!upstream) {
    return (
      <DefaultPage>
        <Section name="Upstream aktualisieren">
          <p>Upstream nicht gefunden.</p>
        </Section>
      </DefaultPage>
    );
  }

  return (
    <DefaultPage>
      <Section name="Upstream aktualisieren">
        <GeneratedForm definition={FRONTIER_UPSTREAM_UPDATE_FORM(domainGroupId, upstreamGroupId, upstreamId, upstream)} />
      </Section>
    </DefaultPage>
  );
}
