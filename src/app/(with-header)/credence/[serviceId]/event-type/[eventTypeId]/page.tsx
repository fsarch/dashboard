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
import EventTypeDetail from './_components/EventTypeDetail.component';

export const generateMetadata = createAutomaticMetadata();

type EventTypeDetailPageProps = {
  params: Promise<{ serviceId: string; eventTypeId: string }>;
};

export default async function EventTypeDetailPage({ params }: EventTypeDetailPageProps) {
  const { serviceId, eventTypeId } = await params;

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
    const eventType = await credenceService.getEventTypeById(eventTypeId, serviceId);

    return (
      <DefaultPage>
        <Section name="Event Type Details">
          <EventTypeDetail eventType={eventType} serviceId={serviceId} />
        </Section>
      </DefaultPage>
    );
  } catch (error) {
    return notFound();
  }
}
