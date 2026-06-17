import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import List from '@/components/universals/list/List';
import LinkListItem from '@/components/universals/list/LinkListItem';
import { frontierService } from '@/services/frontier/frontier.service';
import { getServiceLocalUrl } from '@/utils/getServiceLocalUrl';
import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
import Button from '@/components/universals/forms/Button';
import Link from 'next/link';
import { uacUtils } from '@/utils/uac.utils';
import DevResponseSection from '@/components/universals/section/DevResponseSection.component';

export const generateMetadata = createAutomaticMetadata();

export default async function FrontierServicePage() {
  const [domainGroups, createLink, canSeeDevResponse] = await Promise.all([
    frontierService.listDomainGroups(),
    getServiceLocalUrl('/domain-group/create'),
    uacUtils.isDeveloper(),
  ]);

  return (
    <DefaultPage>
      <Section name="Domain Groups">
        <div style={{ marginBottom: '16px' }}>
          <Link href={createLink}>
            <Button type="button">+ Neue Domain Group</Button>
          </Link>
        </div>
        <List>
          {domainGroups.map(async (group) => (
            <LinkListItem
              key={group.id}
              href={await getServiceLocalUrl(`/domain-group/${group.id}`)}
            >
              {group.name}
            </LinkListItem>
          ))}
        </List>
      </Section>
      {canSeeDevResponse ? (
        <DevResponseSection title="Domain Groups" response={domainGroups} />
      ) : null}
    </DefaultPage>
  );
}

