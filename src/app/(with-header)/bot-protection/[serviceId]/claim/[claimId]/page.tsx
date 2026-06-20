import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
import { getAccessToken } from '@/utils/getAccessToken';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { uacUtils } from '@/utils/uac.utils';
import { getServiceConfigurationById } from '@/utils/configuration.utils';
import { EServiceType } from '@/utils/configuration.type';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import { botProtectionService } from '@/services/bot-protection/bot-protection.service';
import ClaimDetail from './_components/ClaimDetail.component';

export const generateMetadata = createAutomaticMetadata();

type ClaimDetailPageProps = {
  params: Promise<{ serviceId: string; claimId: string }>;
};

export default async function ClaimDetailPage({ params }: ClaimDetailPageProps) {
  const { serviceId, claimId } = await params;

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
    EServiceType.BOT_PROTECTION,
    serviceId,
    accessToken
  );
  if (!canAccessService) {
    return notFound();
  }

  try {
    const claim = await botProtectionService.getClaimById(claimId, serviceId);

    return (
      <DefaultPage>
        <Section name={`Claim: ${claim.id}`}>
          <ClaimDetail claim={claim} serviceId={serviceId} />
        </Section>
      </DefaultPage>
    );
  } catch (error) {
    return notFound();
  }
}
