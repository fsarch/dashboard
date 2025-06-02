import Section from "@/components/universals/section/Section";
import { manufacturerService } from "@/services/material-tracing/manufacturer.service";
import ManufacturerRemove
  from "@/app/(with-header)/material-tracing/[serviceId]/manufacturer/[manufacturerId]/_components/remove/ManufacturerRemove.component";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import { createAutomaticMetadata } from "@/utils/createAutomaticMetadata";
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";

export const generateMetadata = createAutomaticMetadata();

export default async function Home({ params }: { params: Promise<{ manufacturerId: string }> }) {
  const manufacturer = await manufacturerService.getManufacturer((await params).manufacturerId);

  return (
    <DefaultPage>
      <Section name="Information">
        Name: {manufacturer.name}
      </Section>
      <ManufacturerRemove
        manufacturerId={manufacturer.id}
        homeUrl={await getServiceLocalUrl('/manufacturer')}
      />
    </DefaultPage>
  );
}
