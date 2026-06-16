import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
import { getAccessToken } from '@/utils/getAccessToken';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { uacUtils } from '@/utils/uac.utils';
import { getServiceConfigurationById } from '@/utils/configuration.utils';
import { EServiceType } from '@/utils/configuration.type';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import { credenceService } from '@/services/credence/credence.service';
import ScopeTypesList from './_components/ScopeTypesList.component';
import GeneratedForm from '@/components/universals/forms/generated/GeneratedForm.component';
import { SCOPE_TYPE_CREATE_FORM } from './_forms/scope-type-create.form';

export const generateMetadata = createAutomaticMetadata();

type ScopeTypesPageProps = {
  params: Promise<{ serviceId: string }>;
  searchParams: Promise<{ page?: string; pageSize?: string }>;
};

export default async function ScopeTypesPage({
  params,
  searchParams,
}: ScopeTypesPageProps) {
  const { serviceId } = await params;
  const { page = '1', pageSize = '25' } = await searchParams;

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
    EServiceType.CREDENCE,
    serviceId,
    accessToken
  );
  if (!canAccessService) {
    return notFound();
  }

  const scopeTypes = await credenceService.listScopeTypes(
    { page: parseInt(page), pageSize: parseInt(pageSize) },
    serviceId
  );

  return (
    <DefaultPage>
      <Section name="Scope Type erstellen">
        <GeneratedForm definition={SCOPE_TYPE_CREATE_FORM} />
      </Section>
      <Section name="Scope Types">
        <ScopeTypesList
          scopeTypes={scopeTypes}
          serviceId={serviceId}
          page={parseInt(page)}
          pageSize={parseInt(pageSize)}
        />
      </Section>
    </DefaultPage>
  );
}
