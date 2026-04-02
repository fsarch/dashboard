import { DefaultPage } from "@/components/universals/page/DefaultPage.component";
import Section from "@/components/universals/section/Section";
import { createAutomaticMetadata } from "@/utils/createAutomaticMetadata";
import { emailService } from "@/services/email/email.service";
import { EmailSendForm } from "@/components/apps/email/EmailSendForm.component";
import Link from "next/link";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import Button from "@/components/universals/forms/Button";

export const generateMetadata = createAutomaticMetadata();

export default async function CreateEmailPage({ params }: { params: Promise<{ accountId: string }> }) {
  const accountId = (await params).accountId;
  const [account, backLink] = await Promise.all([
    emailService.getAccount(accountId),
    getServiceLocalUrl(`/account/${accountId}`),
  ]);

  return (
    <DefaultPage>
      <Section name="E-Mail senden">
        <p><strong>Account:</strong> {account.name}</p>
        <p><strong>Absender:</strong> {account.options.eMailAddress}</p>
        <EmailSendForm accountId={accountId} />
      </Section>
      <div style={{ marginTop: '24px' }}>
        <Link href={backLink}>
          <Button type="button">
            ← Zurück zum Account
          </Button>
        </Link>
      </div>
    </DefaultPage>
  );
}

