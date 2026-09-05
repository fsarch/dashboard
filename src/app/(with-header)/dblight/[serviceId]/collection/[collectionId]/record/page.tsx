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
import RecordsList from '@/components/apps/dblight/RecordsList.component';

export const generateMetadata = createAutomaticMetadata();

type RecordsPageProps = {
  params: Promise<{ serviceId: string; collectionId: string }>;
  searchParams: Promise<{ cursor?: string }>;
};

export default async function RecordsPage({ params, searchParams }: RecordsPageProps) {
  const { serviceId, collectionId } = await params;
  const { cursor } = await searchParams;

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

  const collection = await dblightService.getCollection(collectionId, serviceId);
  const page = await dblightService.listRecords(collectionId, { cursor, limit: 25 }, serviceId);

  return (
    <DefaultPage>
      <Section name={`Einträge: ${collection.name}`}>
        <RecordsList page={page} serviceId={serviceId} collectionId={collectionId} />
      </Section>
    </DefaultPage>
  );
}
