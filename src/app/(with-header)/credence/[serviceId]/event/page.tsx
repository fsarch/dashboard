import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
import { getAccessToken } from '@/utils/getAccessToken';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { uacUtils } from '@/utils/uac.utils';
import { getServiceConfigurationById } from '@/utils/configuration.utils';
import { EServiceType } from '@/utils/configuration.type';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import CreateEventForm from './_components/CreateEventForm.component';

export const generateMetadata = createAutomaticMetadata();

type EventsPageProps = {
  params: Promise<{ serviceId: string }>;
};

export default async function EventsPage({ params }: EventsPageProps) {
  const { serviceId } = await params;

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

  return (
    <DefaultPage>
      <Section name="Event erstellen">
        <p>Hier können Sie neue Events erstellen, um Scores für Identifikatoren zu generieren.</p>
        <CreateEventForm serviceId={serviceId} />
      </Section>
    </DefaultPage>
  );
}
