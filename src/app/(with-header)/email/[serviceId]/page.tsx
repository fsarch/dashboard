import { DefaultPage } from "@/components/universals/page/DefaultPage.component";
import Section from "@/components/universals/section/Section";
import List from "@/components/universals/list/List";
import LinkListItem from "@/components/universals/list/LinkListItem";
import { emailService } from "@/services/email/email.service";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import { EmailAccountCreateForm } from "@/components/apps/email/EmailAccountCreateForm.component";
import { createAutomaticMetadata } from "@/utils/createAutomaticMetadata";

export const generateMetadata = createAutomaticMetadata();

export default async function Home() {
  const accounts = await emailService.listAccounts();

  return (
    <DefaultPage>
      <Section name="Account erstellen">
        <EmailAccountCreateForm />
      </Section>
      <Section name="Accounts">
        <List>
          {accounts.map(async (account) => (
            <LinkListItem key={account.id} href={await getServiceLocalUrl(`/account/${account.id}`)}>
              {account.name} ({account.alias})
            </LinkListItem>
          ))}
        </List>
      </Section>
    </DefaultPage>
  );
}

