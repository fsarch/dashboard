import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import List from '@/components/universals/list/List';
import ListItem from '@/components/universals/list/ListItem';
import { frontierService } from '@/services/frontier/frontier.service';
import { getServiceLocalUrl } from '@/utils/getServiceLocalUrl';
import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
import Button from '@/components/universals/forms/Button';
import Link from 'next/link';
import { uacUtils } from '@/utils/uac.utils';
import DevResponseSection from '@/components/universals/section/DevResponseSection.component';
import ActionButton from '@/components/universals/forms/button/ActionButton';
import Icon from '@/components/universals/icon/Icon.component';

export const generateMetadata = createAutomaticMetadata();

export default async function UpstreamGroupDetailPage({
  params,
}: {
  params: Promise<{ serviceId: string; domainGroupId: string; upstreamGroupId: string }>;
}) {
  const { serviceId, domainGroupId, upstreamGroupId } = await params;

  const [upstreamGroup, upstreams, canSeeDevResponse] = await Promise.all([
    frontierService.getUpstreamGroupById(domainGroupId, upstreamGroupId),
    frontierService.listUpstreams(domainGroupId, upstreamGroupId),
    uacUtils.isDeveloper(),
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

  const [upstreamCreateLink, upstreamGroupEditLink, upstreamGroupDeleteAction] = await Promise.all([
    getServiceLocalUrl(`/domain-group/${domainGroupId}/upstream-group/${upstreamGroupId}/upstream/create`),
    getServiceLocalUrl(`/domain-group/${domainGroupId}/upstream-group/${upstreamGroupId}/update`),
    getServiceLocalUrl(`/domain-group/${domainGroupId}/upstream-group/${upstreamGroupId}/delete`),
  ]);

  return (
    <DefaultPage>
      <Section name={`Upstream Group: ${upstreamGroup.name}`}>
        <p><strong>ID:</strong> {upstreamGroup.id}</p>
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
          <Link href={upstreamGroupEditLink}>
            <Button type="button">
              <Icon icon="edit" /> Bearbeiten
            </Button>
          </Link>
          <form action={upstreamGroupDeleteAction} method="POST">
            <Button
              type="submit"
              color="#BB0000"
            >
              <Icon icon="trash" /> Löschen
            </Button>
          </form>
        </div>
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
              <Link href={`/frontier/${serviceId}/domain-group/${domainGroupId}/upstream-group/${upstreamGroupId}/upstream/${upstream.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                {upstream.name} — {upstream.protocol ?? 'http'}://{upstream.host}:{upstream.port}{upstream.path}
                {upstream.sslOptions?.sslVerify === false && <span style={{ marginLeft: '8px', color: 'orange' }}>SSL Verify: OFF</span>}
              </Link>
            </ListItem>
          ))}
        </List>
      </Section>
      {canSeeDevResponse ? (
        <DevResponseSection title="Upstream Group Detail" response={{ upstreamGroup, upstreams }} />
      ) : null}
    </DefaultPage>
  );
}

