import Section from "@/components/universals/section/Section";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import MaterialTypeRemove
  from "@/app/(with-header)/material-tracing/[serviceId]/material-type/[materialTypeId]/_components/remove/MaterialTypeRemove.component";
import { materialTypeService } from "@/services/material-tracing/material-type.service";

export default async function Home({ params }: { params: Promise<{ materialTypeId: string }> }) {
  const materialType = await materialTypeService.getMaterialType((await params).materialTypeId);

  return (
    <main>
      <Section name="Information">
        Name: {materialType.name}
      </Section>
      <MaterialTypeRemove
        materialTypeId={materialType.id}
        homeUrl={await getServiceLocalUrl('/material-type')}
      />
    </main>
  );
}
