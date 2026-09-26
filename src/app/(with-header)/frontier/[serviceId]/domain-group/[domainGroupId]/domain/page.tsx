import Link from 'next/link';
import Button from '@/components/universals/forms/Button';
import List from '@/components/universals/list/List';
import ListItem from '@/components/universals/list/ListItem';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import DevResponseSection from '@/components/universals/section/DevResponseSection.component';
import Section from '@/components/universals/section/Section';
import { frontierService } from '@/services/frontier/frontier.service';
import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
import { getServiceLocalUrl } from '@/utils/getServiceLocalUrl';
import { uacUtils } from '@/utils/uac.utils';

export const generateMetadata = createAutomaticMetadata();

export default async function DomainListPage({
  params,
}: {
  params: Promise<{ domainGroupId: string }>;
}) {
  const { domainGroupId } = await params;

  const [domains, createLink, canSeeDevResponse] = await Promise.all([
    frontierService.listDomains(domainGroupId),
    getServiceLocalUrl(`/domain-group/${domainGroupId}/domain/create`),
    uacUtils.isDeveloper(),
  ]);

  return (
    <DefaultPage>
      <Section name="Domains">
        <div style={{ marginBottom: '12px' }}>
          <Link href={createLink}>
            <Button type="button">+ Domain hinzufügen</Button>
          </Link>
        </div>
        <List>
          {domains.map((domain) => (
            <ListItem key={domain.id}>{domain.domainName}</ListItem>
          ))}
        </List>
      </Section>
      {canSeeDevResponse ? (
        <DevResponseSection title="Domains" response={domains} />
      ) : null}
    </DefaultPage>
  );
}
