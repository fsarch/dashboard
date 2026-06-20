import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
import { getAccessToken } from '@/utils/getAccessToken';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { uacUtils } from '@/utils/uac.utils';
import { getServiceConfigurationById } from '@/utils/configuration.utils';
import { EServiceType } from '@/utils/configuration.type';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import { credenceService } from '@/services/credence/credence.service';
import ScopeDetail from '../_components/ScopeDetail.component';

export const generateMetadata = createAutomaticMetadata();

type ScopeDetailPageProps = {
  params: Promise<{ serviceId: string; scopeId: string }>;
};

export default async function ScopeDetailPage({ params }: ScopeDetailPageProps) {
  const { serviceId, scopeId } = await params;

  const accessToken = await getAccessToken();

  if (!accessToken) {
    const callbackUrl = (await headers()).get('X-Original-URL') || '/';
    return redirect(`/api/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  const service = await getServiceConfigurationById(serviceId);

  if (service) {
    const canAccessService = await uacUtils.hasAppPermission(
      EServiceType.CREDENCE,
      serviceId,
      accessToken
    );
    if (!canAccessService) {
      return notFound();
    }
  }
  if (!service) {
    return notFound();
  }

  try {
    const scope = await credenceService.getScopeById(scopeId, serviceId);

    return (
      <DefaultPage>
        <Section name="Scope Details">
          <ScopeDetail scope={scope} serviceId={serviceId} />
        </Section>
      </DefaultPage>
    );
  } catch (error) {
    return notFound();
  }
}
