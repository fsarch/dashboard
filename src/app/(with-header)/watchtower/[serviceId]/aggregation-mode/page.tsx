import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
import { getAccessToken } from '@/utils/getAccessToken';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { uacUtils } from '@/utils/uac.utils';
import { getServiceConfigurationById } from '@/utils/configuration.utils';
import { EServiceType } from '@/utils/configuration.type';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import { watchtowerService } from '@/services/watchtower/watchtower.service';
import AggregationModesList from './_components/AggregationModesList.component';
import GeneratedForm from '@/components/universals/forms/generated/GeneratedForm.component';
import { AGGREGATION_MODE_CREATE_FORM } from './_forms/aggregation-mode-create.form';

export const generateMetadata = createAutomaticMetadata();

type AggregationModesPageProps = {
  params: Promise<{ serviceId: string }>;
  searchParams: Promise<{ page?: string; pageSize?: string }>;
};

export default async function AggregationModesPage({
  params,
  searchParams,
}: AggregationModesPageProps) {
  const { serviceId } = await params;
  const { page = '1', pageSize = '25' } = await searchParams;

  const accessToken = await getAccessToken();

  if (!accessToken) {
    const callbackUrl = (await headers()).get('X-Original-URL') || '/';
    return redirect(`/api/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  const service = await getServiceConfigurationById(serviceId);

  if (service) {
    const canAccessService = await uacUtils.hasAppPermission(
      EServiceType.WATCHTOWER,
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

  try {
    const aggregationModes = await watchtowerService.listAggregationModes(
      {
        page: parseInt(page),
        pageSize: parseInt(pageSize),
      },
      serviceId
    );

    return (
      <DefaultPage>
        <Section name="Aggregation Mode erstellen">
          <GeneratedForm definition={AGGREGATION_MODE_CREATE_FORM} />
        </Section>
        <Section name="Aggregation Modes">
          <AggregationModesList
            aggregationModes={aggregationModes}
            serviceId={serviceId}
            page={parseInt(page)}
            pageSize={parseInt(pageSize)}
          />
        </Section>
      </DefaultPage>
    );
  } catch (error) {
    return notFound();
  }
}
