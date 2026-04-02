import { DefaultPage } from "@/components/universals/page/DefaultPage.component";
import Section from "@/components/universals/section/Section";
import { EmailAccountCreateForm } from "@/components/apps/email/EmailAccountCreateForm.component";
import { createAutomaticMetadata } from "@/utils/createAutomaticMetadata";
import Link from "next/link";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import Button from "@/components/universals/forms/Button";

export const generateMetadata = createAutomaticMetadata();

export default async function CreateAccountPage() {
  const backLink = await getServiceLocalUrl('');

  return (
    <DefaultPage>
      <Section name="Neuer Account">
        <EmailAccountCreateForm />
      </Section>
      <div style={{ marginTop: '24px' }}>
        <Link href={backLink}>
          <Button type="button">
            ← Zurück zu Accounts
          </Button>
        </Link>
      </div>
    </DefaultPage>
  );
}

