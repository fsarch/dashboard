import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
import { getAccessToken } from '@/utils/getAccessToken';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { uacUtils } from '@/utils/uac.utils';
import { getServiceConfigurationById } from '@/utils/configuration.utils';
import { EServiceType } from '@/utils/configuration.type';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import { metricService } from '@/services/metric/metric.service';
import MetricDetail from './_components/MetricDetail.component';

export const generateMetadata = createAutomaticMetadata();

type MetricDetailPageProps = {
  params: Promise<{ serviceId: string; metricId: string }>;
};

export default async function MetricDetailPage({ params }: MetricDetailPageProps) {
  const { serviceId, metricId } = await params;

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
    EServiceType.METRIC,
    serviceId,
    accessToken
  );
  if (!canAccessService) {
    return notFound();
  }

  const metric = await metricService.getMetricById(metricId, serviceId);
  if (!metric) {
    return notFound();
  }

  return (
    <DefaultPage>
      <Section name={`Metric: ${metric.name}`}>
        <MetricDetail metric={metric} serviceId={serviceId} />
      </Section>
    </DefaultPage>
  );
}
