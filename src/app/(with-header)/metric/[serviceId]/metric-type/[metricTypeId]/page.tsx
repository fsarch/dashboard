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
import Link from 'next/link';
import { getServiceLocalUrl } from '@/utils/getServiceLocalUrl';

export const generateMetadata = createAutomaticMetadata();

type MetricTypeDetailPageProps = {
  params: Promise<{ serviceId: string; metricTypeId: string }>;
};

export default async function MetricTypeDetailPage({ params }: MetricTypeDetailPageProps) {
  const { serviceId, metricTypeId } = await params;

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

  const metricType = await metricService.getMetricTypeById(metricTypeId, serviceId);
  console.log(metricTypeId, metricType);

  if (!metricType) {
    return notFound();
  }

  return (
    <DefaultPage>
      <Section name="Metric Type Details">
        <div>
          <p><strong>ID:</strong> {metricType.id}</p>
          <p><strong>Name:</strong> {metricType.name}</p>
          {metricType.externalId && <p><strong>External ID:</strong> {metricType.externalId}</p>}
          <p><strong>Created:</strong> {new Date(metricType.creationTime).toLocaleString()}</p>
        </div>
      </Section>
      <Section name="Actions">
        <Link
          href={await getServiceLocalUrl(`/metric-type`)}
          style={{ display: 'inline-block', marginRight: '1rem' }}
        >
          Back to Metric Types
        </Link>
        <Link
          href={await getServiceLocalUrl(`/metric?metricTypeId=${metricType.id}`)}
          style={{ display: 'inline-block' }}
        >
          View Metrics with this Type
        </Link>
      </Section>
    </DefaultPage>
  );
}
