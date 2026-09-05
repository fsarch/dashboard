import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
import { getAccessToken } from '@/utils/getAccessToken';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { uacUtils } from '@/utils/uac.utils';
import { getServiceConfigurationById } from '@/utils/configuration.utils';
import { EServiceType } from '@/utils/configuration.type';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import { dblightService } from '@/services/dblight/dblight.service';
import RecordDetail from '@/components/apps/dblight/RecordDetail.component';

export const generateMetadata = createAutomaticMetadata();

type RecordPageProps = {
  params: Promise<{ serviceId: string; collectionId: string; recordId: string }>;
};

export default async function RecordPage({ params }: RecordPageProps) {
  const { serviceId, collectionId, recordId } = await params;

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
    EServiceType.DBLIGHT,
    serviceId,
    accessToken,
  );
  if (!canAccessService) {
    return notFound();
  }

  const record = await dblightService.getRecord(collectionId, recordId, serviceId);

  return (
    <DefaultPage>
      <Section name={`Eintrag: ${record.id}`}>
        <RecordDetail record={record} serviceId={serviceId} collectionId={collectionId} />
      </Section>
    </DefaultPage>
  );
}
