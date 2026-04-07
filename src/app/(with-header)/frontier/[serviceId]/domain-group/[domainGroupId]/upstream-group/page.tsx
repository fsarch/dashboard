import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import List from '@/components/universals/list/List';
import LinkListItem from '@/components/universals/list/LinkListItem';
import { frontierService } from '@/services/frontier/frontier.service';
import { getServiceLocalUrl } from '@/utils/getServiceLocalUrl';
import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
import Button from '@/components/universals/forms/Button';
import Link from 'next/link';

export const generateMetadata = createAutomaticMetadata();

export default async function UpstreamGroupListPage({
  params,
}: {
  params: Promise<{ domainGroupId: string }>;
}) {
  const { domainGroupId } = await params;

  const [upstreamGroups, createLink] = await Promise.all([
    frontierService.listUpstreamGroups(domainGroupId),
    getServiceLocalUrl(`/domain-group/${domainGroupId}/upstream-group/create`),
  ]);

  return (
    <DefaultPage>
      <Section name="Upstream Groups">
        <div style={{ marginBottom: '12px' }}>
          <Link href={createLink}>
            <Button type="button">+ Upstream Group erstellen</Button>
          </Link>
        </div>
        <List>
          {upstreamGroups.map(async (group) => (
            <LinkListItem
              key={group.id}
              href={await getServiceLocalUrl(`/domain-group/${domainGroupId}/upstream-group/${group.id}`)}
            >
              {group.name}
            </LinkListItem>
          ))}
        </List>
      </Section>
    </DefaultPage>
  );
}

