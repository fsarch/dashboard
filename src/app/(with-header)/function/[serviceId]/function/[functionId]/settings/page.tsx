import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
import { getAccessToken } from '@/utils/getAccessToken';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { uacUtils } from '@/utils/uac.utils';
import { getServiceConfigurationById } from '@/utils/configuration.utils';
import { EServiceType } from '@/utils/configuration.type';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import FunctionSettingsForm from '../_components/FunctionSettingsForm.component';
import { functionService } from '@/services/function/function.service';
import { FunctionDto } from '@/services/function/function.type';

export const generateMetadata = createAutomaticMetadata();

type FunctionSettingsPageProps = {
  params: Promise<{ serviceId: string; functionId: string }>;
};

export default async function FunctionSettingsPage({ params }: FunctionSettingsPageProps) {
  const { serviceId, functionId } = await params;

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
    EServiceType.FUNCTION,
    serviceId,
    accessToken
  );
  if (!canAccessService) {
    return notFound();
  }

  const functionDetails = await functionService.listFunctions() as FunctionDto[];
  const functionDetail = functionDetails.find(f => f.id === functionId);

  if (!functionDetail) {
    return notFound();
  }

  return (
    <DefaultPage>
      <FunctionSettingsForm function={functionDetail} serviceId={serviceId} />
    </DefaultPage>
  );
}
