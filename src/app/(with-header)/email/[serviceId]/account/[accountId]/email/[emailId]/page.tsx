import { DefaultPage } from "@/components/universals/page/DefaultPage.component";
import Section from "@/components/universals/section/Section";
import Badge from "@/components/universals/badge/badge.component";
import { datetimeUtils } from "@/utils/datetime.utils";
import { emailService } from "@/services/email/email.service";
import { createAutomaticMetadata } from "@/utils/createAutomaticMetadata";

export const generateMetadata = createAutomaticMetadata();

export default async function Home({ params }: { params: Promise<{ accountId: string; emailId: string }> }) {
  const { accountId, emailId } = await params;
  const email = await emailService.getEmail(accountId, emailId);

  return (
    <DefaultPage>
      <Section name="E-Mail Details">
        <p><strong>Betreff:</strong> {email.subject}</p>
        {email.creationTime ? <Badge>{datetimeUtils.formatDate(email.creationTime)}</Badge> : null}
        {email.sendTime ? <Badge>{datetimeUtils.formatDate(email.sendTime)}</Badge> : null}
        {email.readTime ? <Badge>{datetimeUtils.formatDate(email.readTime)}</Badge> : null}
      </Section>
      <Section name="Text Inhalt">
        <p>{email.content.text}</p>
      </Section>
      <Section name="HTML Inhalt">
        <p>{email.content.html}</p>
      </Section>
    </DefaultPage>
  );
}

