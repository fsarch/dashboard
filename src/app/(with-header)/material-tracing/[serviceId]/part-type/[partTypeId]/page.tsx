import { notFound } from 'next/navigation';
import Actions from '@/app/(with-header)/material-tracing/[serviceId]/_components/actions/Actions.component';
import PartTypeInformation from '@/app/(with-header)/material-tracing/[serviceId]/part-type/[partTypeId]/_components/information/PartTypeInformation.component';
import PartTypeRemove from '@/app/(with-header)/material-tracing/[serviceId]/part-type/[partTypeId]/_components/remove/PartTypeRemove.component';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import { partTypeService } from '@/services/material-tracing/part-type.service';
import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
import { getServiceLocalUrl } from '@/utils/getServiceLocalUrl';

export const generateMetadata = createAutomaticMetadata();

export default async function Home({
  params,
}: Readonly<{ params: Promise<{ partTypeId: string }> }>) {
  const partType = await partTypeService.getPartType((await params).partTypeId);
  if (!partType) {
    return notFound();
  }

  return (
    <DefaultPage>
      <PartTypeInformation partType={partType} />
      <Actions type="part_type" basePath={`/v1/part-types/${partType.id}`} />
      <PartTypeRemove
        partTypeId={partType.id}
        homeUrl={await getServiceLocalUrl('/part-type')}
      />
    </DefaultPage>
  );
}
