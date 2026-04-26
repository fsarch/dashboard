import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import List from '@/components/universals/list/List';
import ListItem from '@/components/universals/list/ListItem';
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

  const [upstreamGroup, upstreams] = await Promise.all([
    frontierService.getUpstreamGroup(domainGroupId, upstreamGroupId),
    frontierService.listUpstreams(domainGroupId, upstreamGroupId),
  ]);

  if (!upstreamGroup) {
    return (
      <DefaultPage>
        <Section name="Upstream Group">
          <p>Upstream Group nicht gefunden.</p>
        </Section>
      </DefaultPage>
    );
  }

  const upstreamCreateLink = await getServiceLocalUrl(
    `/domain-group/${domainGroupId}/upstream-group/${upstreamGroupId}/upstream/create`,
  );

  return (
    <DefaultPage>
      <Section name={`Upstream Group: ${upstreamGroup.name}`}>
        <p><strong>ID:</strong> {upstreamGroup.id}</p>
      </Section>
      <Section name="Upstreams">
        <div style={{ marginBottom: '12px' }}>
          <Link href={upstreamCreateLink}>
            <Button type="button">+ Upstream hinzufügen</Button>
          </Link>
        </div>
        <List>
          {upstreams.map((upstream) => (
            <ListItem key={upstream.id}>
              {upstream.name} — {upstream.host}:{upstream.port}{upstream.path}
            </ListItem>
          ))}
        </List>
      </Section>
    </DefaultPage>
  );
}

