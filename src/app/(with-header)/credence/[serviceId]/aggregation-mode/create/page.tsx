import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
import { getAccessToken } from '@/utils/getAccessToken';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { uacUtils } from '@/utils/uac.utils';
import { getServiceConfigurationById } from '@/utils/configuration.utils';
import { EServiceType } from '@/utils/configuration.type';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import GeneratedForm from '@/components/universals/forms/generated/GeneratedForm.component';
import { AGGREGATION_MODE_CREATE_FORM } from '../_forms/aggregation-mode-create.form';

export const generateMetadata = createAutomaticMetadata();

type AggregationModeCreatePageProps = {
  params: Promise<{ serviceId: string }>;
};

export default async function AggregationModeCreatePage({ params }: AggregationModeCreatePageProps) {
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
      <Section name="Create Aggregation Mode">
        <GeneratedForm definition={AGGREGATION_MODE_CREATE_FORM} />
      </Section>
    </DefaultPage>
  );
}
