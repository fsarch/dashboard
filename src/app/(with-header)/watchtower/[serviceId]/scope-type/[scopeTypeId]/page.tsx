import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
import { getAccessToken } from '@/utils/getAccessToken';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { uacUtils } from '@/utils/uac.utils';
import { getServiceConfigurationById } from '@/utils/configuration.utils';
import { EServiceType } from '@/utils/configuration.type';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import { watchtowerService } from '@/services/watchtower/watchtower.service';
import ScopeTypeDetail from './_components/ScopeTypeDetail.component';

export const generateMetadata = createAutomaticMetadata();

type ScopeTypeDetailPageProps = {
  params: Promise<{ serviceId: string; scopeTypeId: string }>;
};

export default async function ScopeTypeDetailPage({ params }: ScopeTypeDetailPageProps) {
  const { serviceId, scopeTypeId } = await params;

  const accessToken = await getAccessToken();

  if (!accessToken) {
    const callbackUrl = (await headers()).get('X-Original-URL') || '/';
    return redirect(`/api/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  const service = await getServiceConfigurationById(serviceId);
  
  if (service) {
    const canAccessService = await uacUtils.hasAppPermission(
      EServiceType.WATCHTOWER,
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
    const scopeType = await watchtowerService.getScopeTypeById(scopeTypeId, serviceId);

    return (
      <DefaultPage>
        <Section name="Scope Type Details">
          <ScopeTypeDetail scopeType={scopeType} serviceId={serviceId} />
        </Section>
      </DefaultPage>
    );
  } catch (error) {
    return notFound();
  }
}
