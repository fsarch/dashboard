import { DefaultPage } from "@/components/universals/page/DefaultPage.component";
import Section from "@/components/universals/section/Section";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import { emailService } from "@/services/email/email.service";
import { createAutomaticMetadata } from "@/utils/createAutomaticMetadata";
import EmailSyncButton from "@/components/apps/email/EmailSyncButton.component";
import EmailsList from "@/components/apps/email/EmailsList.component";
import EmailFilters from "@/components/apps/email/EmailFilters.component";
import Link from "next/link";
import Button from "@/components/universals/forms/Button";
import { loadPaginatedEmailsAction } from "./emails.server-action";

export const generateMetadata = createAutomaticMetadata();

const PAGE_SIZE = 25;

export default async function Home({
  params,
  searchParams,
}: {
  params: Promise<{ accountId: string }>;
  searchParams: Promise<Record<string, string>>;
}) {
  const accountId = (await params).accountId;
  const { search, sort } = await searchParams;
  const composeLink = await getServiceLocalUrl(`/account/${accountId}/email/create`);

  const [account, initialEmailsResult] = await Promise.all([
    emailService.getAccount(accountId),
    emailService.listEmails(accountId, { page: 1, limit: PAGE_SIZE, search, sort }),
  ]);

  const emailsWithUrls = await Promise.all(
    initialEmailsResult.data.map(async (email) => ({
      ...email,
      url: await getServiceLocalUrl(`/account/${accountId}/email/${email.id}`),
    })),
  );

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
        <EmailFilters />
        <EmailsList
          initialEmails={emailsWithUrls}
          initialTotalItems={initialEmailsResult.metadata.totalItems}
          fetchEmails={loadPaginatedEmailsAction.bind(null, accountId)}
          search={search}
          sort={sort}
        />
      </Section>
    </DefaultPage>
  );
}

