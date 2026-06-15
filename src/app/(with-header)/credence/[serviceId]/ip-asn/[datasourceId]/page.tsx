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
import IpAsnDatasourceDetail from './_components/IpAsnDatasourceDetail.component';
import CreateIpAsnDataForm from './_components/CreateIpAsnDataForm.component';

export const generateMetadata = createAutomaticMetadata();

type IpAsnDatasourceDetailPageProps = {
  params: Promise<{ serviceId: string; datasourceId: string }>;
  searchParams: Promise<{ page?: string; pageSize?: string }>;
};

export default async function IpAsnDatasourceDetailPage({
  params,
  searchParams,
}: IpAsnDatasourceDetailPageProps) {
  const { serviceId, datasourceId } = await params;
  const { page = '1', pageSize = '25' } = await searchParams;

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

  try {
    const datasource = await credenceService.getIpAsnDatasourceById(datasourceId, serviceId);
    const ipAsnData = await credenceService.listIpAsnData(
      datasourceId,
      { page: parseInt(page), pageSize: parseInt(pageSize) },
      serviceId
    );

    return (
      <DefaultPage>
        <Section name="IP-ASN Datasource Details">
          <IpAsnDatasourceDetail
            datasource={datasource}
            ipAsnData={ipAsnData}
            serviceId={serviceId}
            datasourceId={datasourceId}
            page={parseInt(page)}
            pageSize={parseInt(pageSize)}
          />
        </Section>
        <Section name="IP-ASN Daten erstellen">
          <CreateIpAsnDataForm
            datasourceId={datasourceId}
            serviceId={serviceId}
          />
        </Section>
      </DefaultPage>
    );
  } catch (error) {
    return notFound();
  }
}
