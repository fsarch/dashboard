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
import CollectionsList from '@/components/apps/dblight/CollectionsList.component';
import CollectionCreateForm from '@/components/apps/dblight/CollectionCreateForm.component';

export const generateMetadata = createAutomaticMetadata();

type DblightServicePageProps = {
  params: Promise<{ serviceId: string }>;
};

export default async function DblightServicePage({ params }: DblightServicePageProps) {
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
    EServiceType.DBLIGHT,
    serviceId,
    accessToken,
  );
  if (!canAccessService) {
    return notFound();
  }

  const collections = await dblightService.listCollections(serviceId);

  return (
    <DefaultPage>
      <Section name="Collections">
        <CollectionsList collections={collections} serviceId={serviceId} />
      </Section>
      <Section name="Collection erstellen">
        <CollectionCreateForm serviceId={serviceId} />
      </Section>
    </DefaultPage>
  );
}
