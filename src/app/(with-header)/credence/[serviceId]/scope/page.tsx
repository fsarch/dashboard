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
import ScopesList from './_components/ScopesList.component';

export const generateMetadata = createAutomaticMetadata();

type ScopesPageProps = {
  params: Promise<{ serviceId: string }>;
  searchParams: Promise<{ page?: string; pageSize?: string }>;
};

export default async function ScopesPage({
  params,
  searchParams,
}: ScopesPageProps) {
  const { serviceId } = await params;
  const { page = '1', pageSize = '25' } = await searchParams;

  const accessToken = await getAccessToken();

  if (!accessToken) {
    const callbackUrl = (await headers()).get('X-Original-URL') || '/';
    return redirect(`/api/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  const service = await getServiceConfigurationById(serviceId);
  if (!service) {
    return notFound();
  }

  const canAccessService = await uacUtils.hasAppPermission(
    EServiceType.CREDENCE,
    serviceId,
    accessToken
  );
  if (!canAccessService) {
    return notFound();
  }

  const scopes = await credenceService.listScopes(
    { page: parseInt(page), pageSize: parseInt(pageSize) },
    serviceId
  );

  return (
    <DefaultPage>
      <Section name="Scopes">
        <ScopesList
          scopes={scopes}
          serviceId={serviceId}
          page={parseInt(page)}
          pageSize={parseInt(pageSize)}
        />
      </Section>
    </DefaultPage>
  );
}
