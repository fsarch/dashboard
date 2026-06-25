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
import MetricTypesList from './_components/MetricTypesList.component';

export const generateMetadata = createAutomaticMetadata();

type MetricTypesPageProps = {
  params: Promise<{ serviceId: string }>;
  searchParams: Promise<{ page?: string; pageSize?: string }>;
};

export default async function MetricTypesPage({
  params,
  searchParams,
}: MetricTypesPageProps) {
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
    EServiceType.METRIC,
    serviceId,
    accessToken
  );
  if (!canAccessService) {
    return notFound();
  }

  const metricTypes = await metricService.listMetricTypes(
    { page: parseInt(page), pageSize: parseInt(pageSize) },
    serviceId
  );

  return (
    <DefaultPage>
      <Section name="Metric Types">
        <MetricTypesList
          metricTypes={metricTypes}
          serviceId={serviceId}
          page={parseInt(page)}
          pageSize={parseInt(pageSize)}
        />
      </Section>
    </DefaultPage>
  );
}
