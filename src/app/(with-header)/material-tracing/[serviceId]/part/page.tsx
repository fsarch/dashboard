import Section from "@/components/universals/section/Section";
import GeneratedForm from "@/components/universals/forms/generated/GeneratedForm.component";
import { partService } from "@/services/material-tracing/part.service";
import { PART_CREATE_FORM } from "@/services/material-tracing/part.forms";
import { createAutomaticMetadata } from "@/utils/createAutomaticMetadata";
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import PartsList from "@/components/apps/material-tracing/part/PartsList.component";
import { loadPartsAction } from "@/app/(with-header)/material-tracing/[serviceId]/part/parts.server-action";

export const generateMetadata = createAutomaticMetadata();

export default async function Home() {
  // Load initial page of parts (page 1, 25 items)
  const initialParts = await partService.listParts({ skip: 0, take: 25 });

  // Add URLs to each part
  const partsWithUrls = await Promise.all(
    initialParts.map(async (part) => ({
      ...part,
      url: await getServiceLocalUrl(`/part/${part.id}`)
    }))
  );

  return (
    <DefaultPage>
      <Section name="Bauteil erstellen">
        <GeneratedForm
          definition={PART_CREATE_FORM}
        />
      </Section>
      <Section name="Bauteile">
        <PartsList initialParts={partsWithUrls} fetchParts={loadPartsAction} />
      </Section>
    </DefaultPage>
  );
}
