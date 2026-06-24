import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
import { getAccessToken } from '@/utils/getAccessToken';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { uacUtils } from '@/utils/uac.utils';
import { getServiceConfigurationById } from '@/utils/configuration.utils';
import { EServiceType } from '@/utils/configuration.type';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import { metricServerService } from '@/services/metric-server/metric-server.service';
import MeasurementsList from './_components/MeasurementsList.component';

export const generateMetadata = createAutomaticMetadata();

type MeasurementsPageProps = {
  params: Promise<{ serviceId: string; metricId: string }>;
  searchParams: Promise<{ limit?: string; offset?: string }>;
};

export default async function MeasurementsPage({
  params,
  searchParams,
}: MeasurementsPageProps) {
  const { serviceId, metricId } = await params;
  const { limit = '50', offset = '0' } = await searchParams;

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
    EServiceType.METRIC_SERVER,
    serviceId,
    accessToken
  );
  if (!canAccessService) {
    return notFound();
  }

  const measurements = await metricServerService.listMeasurements(
    metricId,
    { limit: parseInt(limit), offset: parseInt(offset) },
    serviceId
  );

  return (
    <DefaultPage>
      <Section name="Measurements">
        <MeasurementsList
          measurements={measurements}
          serviceId={serviceId}
          metricId={metricId}
          limit={parseInt(limit)}
          offset={parseInt(offset)}
        />
      </Section>
    </DefaultPage>
  );
}
