import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
import GeneratedForm from '@/components/universals/forms/generated/GeneratedForm.component';
import { FRONTIER_UPSTREAM_CREATE_FORM } from '@/services/frontier/frontier.forms';
export const generateMetadata = createAutomaticMetadata();

export default async function CreateUpstreamPage({
  params,
}: {
  params: Promise<{ serviceId: string; domainGroupId: string; upstreamGroupId: string }>;
}) {
  const { domainGroupId, upstreamGroupId } = await params;

  return (
    <DefaultPage>
      <Section name="Upstream hinzufügen">
        <GeneratedForm definition={FRONTIER_UPSTREAM_CREATE_FORM(domainGroupId, upstreamGroupId)} />
      </Section>
    </DefaultPage>
  );
}

