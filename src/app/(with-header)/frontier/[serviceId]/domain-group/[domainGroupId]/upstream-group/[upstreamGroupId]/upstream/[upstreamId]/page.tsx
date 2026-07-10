import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
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

export default async function UpstreamDetailPage({
  params,
}: {
  params: Promise<{ serviceId: string; domainGroupId: string; upstreamGroupId: string; upstreamId: string }>;
}) {
  const { serviceId, domainGroupId, upstreamGroupId, upstreamId } = await params;

  const [upstream, canSeeDevResponse] = await Promise.all([
    frontierService.getUpstreamById(domainGroupId, upstreamGroupId, upstreamId),
    uacUtils.isDeveloper(),
  ]);

  if (!upstream) {
    return (
      <DefaultPage>
        <Section name="Upstream">
          <p>Upstream nicht gefunden.</p>
        </Section>
      </DefaultPage>
    );
  }

  const [upstreamEditLink, upstreamDeleteAction] = await Promise.all([
    getServiceLocalUrl(`/domain-group/${domainGroupId}/upstream-group/${upstreamGroupId}/upstream/${upstreamId}/update`),
    getServiceLocalUrl(`/domain-group/${domainGroupId}/upstream-group/${upstreamGroupId}/upstream/${upstreamId}/delete`),
  ]);

  return (
    <DefaultPage>
      <Section name={`Upstream: ${upstream.name}`}>
        <p><strong>ID:</strong> {upstream.id}</p>
        <p><strong>Host:</strong> {upstream.host}</p>
        <p><strong>Port:</strong> {upstream.port}</p>
        <p><strong>Pfad:</strong> {upstream.path}</p>
        <p><strong>Protokoll:</strong> {upstream.protocol ?? 'http'}</p>
        <p><strong>SSL Verify:</strong> {upstream.sslOptions?.sslVerify === false ? 'Nein' : 'Ja'}</p>
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
          <Link href={upstreamEditLink}>
            <Button type="button">
              <Icon icon="edit" /> Bearbeiten
            </Button>
          </Link>
          <form action={upstreamDeleteAction} method="POST">
            <Button type="submit" color="#BB0000">
              <Icon icon="trash" /> Löschen
            </Button>
          </form>
        </div>
      </Section>
      {canSeeDevResponse ? (
        <DevResponseSection title="Upstream Detail" response={{ upstream }} />
      ) : null}
    </DefaultPage>
  );
}
