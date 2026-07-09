import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import GeneratedForm from '@/components/universals/forms/generated/GeneratedForm.component';
import { FRONTIER_HOOK_CREATE_FORM } from '@/services/frontier/frontier.forms';
import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';

export const generateMetadata = createAutomaticMetadata();

export default async function CreateHookPage() {
  return (
    <DefaultPage>
      <Section name="Neuen Hook erstellen">
        <GeneratedForm definition={FRONTIER_HOOK_CREATE_FORM} />
      </Section>
    </DefaultPage>
  );
}
