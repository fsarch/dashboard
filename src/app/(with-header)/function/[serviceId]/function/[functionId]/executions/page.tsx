import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
import { getAccessToken } from '@/utils/getAccessToken';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { uacUtils } from '@/utils/uac.utils';
import { getServiceConfigurationById } from '@/utils/configuration.utils';
import { EServiceType } from '@/utils/configuration.type';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import ExecutionsList from '../_components/ExecutionsList.component';
import { functionService } from '@/services/function/function.service';

export const generateMetadata = createAutomaticMetadata();

type FunctionExecutionsPageProps = {
  params: Promise<{ serviceId: string; functionId: string }>;
};

export default async function FunctionExecutionsPage({ params }: FunctionExecutionsPageProps) {
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

  const executions = await functionService.listExecutions(functionId);

  return (
    <DefaultPage>
      <Section name="Executions">
        <ExecutionsList 
          executions={executions} 
          functionId={functionId} 
          serviceId={serviceId}
        />
      </Section>
    </DefaultPage>
  );
}
