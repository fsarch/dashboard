import Section from "@/components/universals/section/Section";
import GeneratedForm from "@/components/universals/forms/generated/GeneratedForm.component";
import { partService } from "@/services/material-tracing/part.service";
import { PART_CREATE_FORM } from "@/services/material-tracing/part.forms";
import { createAutomaticMetadata } from "@/utils/createAutomaticMetadata";
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import PartsList from "@/components/apps/material-tracing/part/PartsList.component";
import { loadPaginatedPartsAction } from "@/app/(with-header)/material-tracing/[serviceId]/part/parts.server-action";
import PartFilters from "@/components/apps/material-tracing/part/PartFilters.component";
import { partTypeService } from "@/services/material-tracing/part-type.service";

export const generateMetadata = createAutomaticMetadata();

export default async function Home({ searchParams }: Readonly<{ searchParams: Promise<Record<string, string>> }>) {
  const params = await searchParams;
  const search = params.search;
  const partTypeId = params.partTypeId;
  const partTypesResult = await partTypeService.listPartTypes({ skip: 0, take: 1000 });

  // Load initial page of parts (page 1, 25 items)
  const initialPartsResult = await partService.listParts({ skip: 0, take: 25, search, partTypeId });

  // Add URLs to each part
  const partsWithUrls = await Promise.all(
    initialPartsResult.data.map(async (part) => ({
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
      <Section name="Bauteile" addPadding={false}>
        <PartFilters partTypes={partTypesResult.data} />
        <PartsList
          initialParts={partsWithUrls}
          initialTotalItems={initialPartsResult.metadata.totalItems}
          fetchParts={loadPaginatedPartsAction}
          search={search}
          partTypeId={partTypeId}
        />
      </Section>
    </DefaultPage>
  );
}
