import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import { metricService } from '@/services/metric/metric.service';
import { EServiceType } from '@/utils/configuration.type';
import { getServiceConfigurationById } from '@/utils/configuration.utils';
import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
import { getAccessToken } from '@/utils/getAccessToken';
import { uacUtils } from '@/utils/uac.utils';
import MetricsList from './_components/MetricsList.component';

export const generateMetadata = createAutomaticMetadata();

type MetricsPageProps = {
  params: Promise<{ serviceId: string }>;
  searchParams: Promise<{
    metricTypeId?: string;
    page?: string;
    pageSize?: string;
    isDeleted?: string;
  }>;
};

export default async function MetricsPage({
  params,
  searchParams,
}: MetricsPageProps) {
  const { serviceId } = await params;
  const {
    metricTypeId,
    page = '1',
    pageSize = '25',
    isDeleted,
  } = await searchParams;

  const accessToken = await getAccessToken();

  if (!accessToken) {
    const callbackUrl = (await headers()).get('X-Original-URL') || '/';
    return redirect(
      `/api/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`,
    );
  }

  const service = await getServiceConfigurationById(serviceId);
  if (!service) {
    return notFound();
  }

  const canAccessService = await uacUtils.hasAppPermission(
    EServiceType.METRIC,
    serviceId,
    accessToken,
  );
  if (!canAccessService) {
    return notFound();
  }

  const metrics = await metricService.listMetrics(
    {
      metricTypeId,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      isDeleted: false,
    },
    serviceId,
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
          isDeleted={false}
        />
      </Section>
    </DefaultPage>
  );
}
