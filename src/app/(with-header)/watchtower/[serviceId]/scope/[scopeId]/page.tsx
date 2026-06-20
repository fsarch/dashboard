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
import ScopeDetail from '../_components/ScopeDetail.component';
import ScopeEventsList from '../_components/ScopeEventsList.component';
import ScopeScoreDisplay from '../_components/ScopeScoreDisplay.component';

export const generateMetadata = createAutomaticMetadata();

type ScopeDetailPageProps = {
  params: Promise<{ serviceId: string; scopeId: string }>;
  searchParams: Promise<{ page?: string; pageSize?: string }>;
};

export default async function ScopeDetailPage({ params, searchParams }: ScopeDetailPageProps) {
  const { serviceId, scopeId } = await params;
  const { page = '1', pageSize = '25' } = await searchParams;

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
    const scope = await watchtowerService.getScopeById(scopeId, serviceId);

    // Fetch events for this scope
    const events = await watchtowerService.listEventsByScope(
      scopeId,
      { page: parseInt(page), pageSize: parseInt(pageSize) },
      serviceId
    );

    // Calculate score for this scope
    const scoreResult = await watchtowerService.calculateScopeScore(scope, serviceId);

    return (
      <DefaultPage>
        <Section name="Scope Details">
          <ScopeDetail scope={scope} serviceId={serviceId} />
        </Section>
        <Section name="Score">
          <ScopeScoreDisplay scoreResult={scoreResult} />
        </Section>
        <Section name="Events">
          <ScopeEventsList
            events={events}
            serviceId={serviceId}
            scopeId={scopeId}
            page={parseInt(page)}
            pageSize={parseInt(pageSize)}
          />
        </Section>
      </DefaultPage>
    );
  } catch (error) {
    return notFound();
  }
}
