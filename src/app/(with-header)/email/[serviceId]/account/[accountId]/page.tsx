import { DefaultPage } from "@/components/universals/page/DefaultPage.component";
import Section from "@/components/universals/section/Section";
import List from "@/components/universals/list/List";
import LinkListItem from "@/components/universals/list/LinkListItem";
import Badge from "@/components/universals/badge/badge.component";
import { datetimeUtils } from "@/utils/datetime.utils";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import { emailService } from "@/services/email/email.service";
import { createAutomaticMetadata } from "@/utils/createAutomaticMetadata";
import EmailSyncButton from "@/components/apps/email/EmailSyncButton.component";
import Link from "next/link";
import Button from "@/components/universals/forms/Button";

export const generateMetadata = createAutomaticMetadata();

export default async function Home({ params }: { params: Promise<{ accountId: string }> }) {
  const accountId = (await params).accountId;
  const composeLink = await getServiceLocalUrl(`/account/${accountId}/email/create`);

  const [account, emails] = await Promise.all([
    emailService.getAccount(accountId),
    emailService.listEmails(accountId),
  ]);

  return (
    <DefaultPage>
      <Section name="Account">
        <p><strong>Name:</strong> {account.name}</p>
        <p><strong>Alias:</strong> {account.alias}</p>
        <p><strong>E-Mail:</strong> {account.options.eMailAddress}</p>
        <div style={{ marginTop: '12px' }}>
          <EmailSyncButton accountId={accountId} />
        </div>
      </Section>
      <Section name="Aktionen">
        <Link href={composeLink}>
          <Button type="button">
            + E-Mail senden
          </Button>
        </Link>
      </Section>
      <Section name="E-Mails">
        <List>
          {emails.map(async (email) => (
            <LinkListItem
              key={email.id}
              href={await getServiceLocalUrl(`/account/${accountId}/email/${email.id}`)}
              right={email.creationTime ? <Badge>{datetimeUtils.formatDate(email.creationTime)}</Badge> : null}
            >
              {email.subject}
            </LinkListItem>
          ))}
        </List>
      </Section>
    </DefaultPage>
  );
}

