import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
import { getAccessToken } from '@/utils/getAccessToken';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { uacUtils } from '@/utils/uac.utils';
import { getServiceConfigurationById } from '@/utils/configuration.utils';
import { EServiceType } from '@/utils/configuration.type';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import { MetricCreateForm } from '@/components/apps/metric/MetricCreateForm.component';

export const generateMetadata = createAutomaticMetadata();

type MetricCreatePageProps = {
  params: Promise<{ serviceId: string }>;
};

export default async function MetricCreatePage({ params }: MetricCreatePageProps) {
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
    EServiceType.METRIC,
    serviceId,
    accessToken
  );
  if (!canAccessService) {
    return notFound();
  }

  return (
    <DefaultPage>
      <Section name="Create Metric">
        <MetricCreateForm />
      </Section>
    </DefaultPage>
  );
}
