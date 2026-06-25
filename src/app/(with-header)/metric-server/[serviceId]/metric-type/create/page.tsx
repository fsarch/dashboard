import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
import { getAccessToken } from '@/utils/getAccessToken';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { uacUtils } from '@/utils/uac.utils';
import { getServiceConfigurationById } from '@/utils/configuration.utils';
import { EServiceType } from '@/utils/configuration.type';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import { MetricTypeCreateForm } from '@/components/apps/metric-server/MetricTypeCreateForm.component';

export const generateMetadata = createAutomaticMetadata();

type MetricTypeCreatePageProps = {
  params: Promise<{ serviceId: string }>;
};

export default async function MetricTypeCreatePage({ params }: MetricTypeCreatePageProps) {
  const { serviceId } = await params;

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

  return (
    <DefaultPage>
      <Section name="Create Metric Type">
        <MetricTypeCreateForm />
      </Section>
    </DefaultPage>
  );
}
