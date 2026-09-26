import GeneratedForm from '@/components/universals/forms/generated/GeneratedForm.component';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import { FRONTIER_DOMAIN_GROUP_CREATE_FORM } from '@/services/frontier/frontier.forms';
import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
export const generateMetadata = createAutomaticMetadata();

export default async function CreateDomainGroupPage() {
  return (
    <DefaultPage>
      <Section name="Neue Domain Group">
        <GeneratedForm definition={FRONTIER_DOMAIN_GROUP_CREATE_FORM} />
      </Section>
    </DefaultPage>
  );
}
