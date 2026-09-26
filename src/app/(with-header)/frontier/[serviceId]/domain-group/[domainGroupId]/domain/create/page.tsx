import GeneratedForm from '@/components/universals/forms/generated/GeneratedForm.component';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import { FRONTIER_DOMAIN_CREATE_FORM } from '@/services/frontier/frontier.forms';
import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
export const generateMetadata = createAutomaticMetadata();

export default async function CreateDomainPage({
  params,
}: {
  params: Promise<{ domainGroupId: string }>;
}) {
  const { domainGroupId } = await params;

  return (
    <DefaultPage>
      <Section name="Domain hinzufügen">
        <GeneratedForm
          definition={FRONTIER_DOMAIN_CREATE_FORM(domainGroupId)}
        />
      </Section>
    </DefaultPage>
  );
}
