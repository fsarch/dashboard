import { DefaultPage } from "@/components/universals/page/DefaultPage.component";
import Section from "@/components/universals/section/Section";
import List from "@/components/universals/list/List";
import LinkListItem from "@/components/universals/list/LinkListItem";
import { emailService } from "@/services/email/email.service";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import { createAutomaticMetadata } from "@/utils/createAutomaticMetadata";
import Button from "@/components/universals/forms/Button";
import Link from "next/link";

export const generateMetadata = createAutomaticMetadata();

export default async function Home() {
  const accounts = await emailService.listAccounts();

  return (
    <DefaultPage>
      <Section name="Accounts">
        <div style={{ marginBottom: '16px' }}>
          <Link href={await getServiceLocalUrl('/account/create')}>
            <Button type="button">
              + Neuer Account
            </Button>
          </Link>
        </div>
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

