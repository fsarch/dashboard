import Section from "@/components/universals/section/Section";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import MaterialTypeRemove
  from "@/app/(with-header)/material-tracing/[serviceId]/material-type/[materialTypeId]/_components/remove/MaterialTypeRemove.component";
import { materialTypeService } from "@/services/material-tracing/material-type.service";
import { createAutomaticMetadata } from "@/utils/createAutomaticMetadata";
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";

export const generateMetadata = createAutomaticMetadata();

export default async function Home({ params }: { params: Promise<{ materialTypeId: string }> }) {
  const materialType = await materialTypeService.getMaterialType((await params).materialTypeId);

  return (
    <DefaultPage>
      <Section name="Information">
        Name: {materialType.name}
      </Section>
      <MaterialTypeRemove
        materialTypeId={materialType.id}
        homeUrl={await getServiceLocalUrl('/material-type')}
      />
    </DefaultPage>
  );
}
