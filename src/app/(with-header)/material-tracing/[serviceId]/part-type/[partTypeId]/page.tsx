import { partTypeService } from "@/services/material-tracing/part-type.service";
import { notFound } from "next/navigation";
import PartTypeRemove
  from "@/app/(with-header)/material-tracing/[serviceId]/part-type/[partTypeId]/_components/remove/PartTypeRemove.component";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import PartTypeInformation
  from "@/app/(with-header)/material-tracing/[serviceId]/part-type/[partTypeId]/_components/information/PartTypeInformation.component";
import { createAutomaticMetadata } from "@/utils/createAutomaticMetadata";
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";
import Actions from "@/app/(with-header)/material-tracing/[serviceId]/_components/actions/Actions.component";

export const generateMetadata = createAutomaticMetadata();

export default async function Home({ params }: Readonly<{ params: Promise<{ partTypeId: string; }> }>) {
  const partType = await partTypeService.getPartType((await params).partTypeId);
  if (!partType) {
    return notFound();
  }

  return (
    <DefaultPage>
      <PartTypeInformation partType={partType} />
      <Actions
        type="part_type"
        basePath={`/v1/part-types/${partType.id}`}
      />
      <PartTypeRemove
        partTypeId={partType.id}
        homeUrl={await getServiceLocalUrl('/part-type')}
      />
    </DefaultPage>
  );
}
