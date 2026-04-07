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

export default async function UpstreamGroupDetailPage({
  params,
}: {
  params: Promise<{ domainGroupId: string; upstreamGroupId: string }>;
}) {
  const { domainGroupId, upstreamGroupId } = await params;

  const upstreams = await frontierService.listUpstreams(domainGroupId, upstreamGroupId);

  const upstreamCreateLink = await getServiceLocalUrl(
    `/domain-group/${domainGroupId}/upstream-group/${upstreamGroupId}/upstream/create`,
  );

  return (
    <DefaultPage>
      <Section name="Upstreams">
        <div style={{ marginBottom: '12px' }}>
          <Link href={upstreamCreateLink}>
            <Button type="button">+ Upstream hinzufügen</Button>
          </Link>
        </div>
        <List>
          {upstreams.map((upstream) => (
            <LinkListItem key={upstream.id} href={`#`}>
              {upstream.name} — {upstream.host}:{upstream.port}{upstream.path}
            </LinkListItem>
          ))}
        </List>
      </Section>
    </DefaultPage>
  );
}

