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
import CollectionDetail from '@/components/apps/dblight/CollectionDetail.component';

export const generateMetadata = createAutomaticMetadata();

type CollectionPageProps = {
  params: Promise<{ serviceId: string; collectionId: string }>;
};

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { serviceId, collectionId } = await params;

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
  const schemaVersions = await dblightService.listSchemaVersions(collectionId, serviceId);
  const activeVersion = schemaVersions.find((v) => v.id === collection.currentSchemaVersionId);

  return (
    <DefaultPage>
      <Section name={`Collection: ${collection.name}`}>
        <CollectionDetail
          collection={collection}
          schema={activeVersion?.schema ?? {}}
          schemaVersions={schemaVersions}
          serviceId={serviceId}
        />
      </Section>
    </DefaultPage>
  );
}
