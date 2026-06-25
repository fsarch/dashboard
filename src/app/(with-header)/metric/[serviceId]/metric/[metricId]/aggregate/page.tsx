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
import AggregateForm from './_components/AggregateForm.component';
import { TMetricDto } from '@/services/metric/metric.type';

export const generateMetadata = createAutomaticMetadata();

type AggregatePageProps = {
  params: Promise<{ serviceId: string; metricId: string }>;
};

export default async function AggregatePage({ params }: AggregatePageProps) {
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

  // Get metric details for context
  let metric: TMetricDto | null = null;
  try {
    metric = await metricService.getMetricById(metricId, serviceId);
  } catch (error) {
    // Metric not found, but we can still show the form
    metric = null;
  }

  return (
    <DefaultPage>
      <Section name={`Aggregate Measurements${metric ? ` for ${metric.name}` : ''}`}>
        <AggregateForm
          serviceId={serviceId}
          metricId={metricId}
          metricName={metric?.name || ''}
        />
      </Section>
    </DefaultPage>
  );
}
