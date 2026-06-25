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
import MetricsList from './_components/MetricsList.component';

export const generateMetadata = createAutomaticMetadata();

type MetricsPageProps = {
  params: Promise<{ serviceId: string }>;
  searchParams: Promise<{ metricTypeId?: string; page?: string; pageSize?: string }>;
};

export default async function MetricsPage({
  params,
  searchParams,
}: MetricsPageProps) {
  const { serviceId } = await params;
  const { metricTypeId = '', page = '1', pageSize = '25' } = await searchParams;

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

  // If no metricTypeId is provided, we need to get all metrics
  // But the API requires metricTypeId, so we'll show an error or get first metric type
  if (!metricTypeId) {
    // Get first metric type to show some metrics
    const metricTypes = await metricService.listMetricTypes(
      { page: 1, pageSize: 1 },
      serviceId
    );

    if (metricTypes.data.length === 0) {
      return (
        <DefaultPage>
          <Section name="Metrics">
            <p>Bitte wählen Sie einen Metric Type aus, um Metrics anzuzeigen.</p>
          </Section>
        </DefaultPage>
      );
    }

    // Redirect to first metric type
    return redirect(`/metric/${serviceId}/metric?metricTypeId=${metricTypes.data[0].id}&page=1&pageSize=25`);
  }

  const metrics = await metricService.listMetrics(
    { metricTypeId, page: parseInt(page), pageSize: parseInt(pageSize) },
    serviceId
  );

  return (
    <DefaultPage>
      <Section name="Metrics">
        <MetricsList
          metrics={metrics}
          serviceId={serviceId}
          metricTypeId={metricTypeId}
          page={parseInt(page)}
          pageSize={parseInt(pageSize)}
        />
      </Section>
    </DefaultPage>
  );
}
