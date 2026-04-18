import List from "@/components/universals/list/List";
import ListItem from "@/components/universals/list/ListItem";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import Link from "next/link";
import Section from "@/components/universals/section/Section";
import { partService } from "@/services/material-tracing/part.service";
import { createAutomaticMetadata } from "@/utils/createAutomaticMetadata";
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";
import PartsList from "@/components/apps/material-tracing/part/PartsList.component";
import {
  loadArchivedPartsAction
} from "@/app/(with-header)/material-tracing/[serviceId]/part/archive/parts.server-action";

export const generateMetadata = createAutomaticMetadata();

export default async function ArchivePage() {
  const partsResult = await partService.listParts({ isArchived: true, skip: 0, take: 25 });

  const partsWithUrls = await Promise.all(
    partsResult.data.map(async (part) => ({
      ...part,
      url: await getServiceLocalUrl(`/part/${part.id}`),
    }))
  );

  return (
    <DefaultPage>
      <Section name="Archivierte Bauteile" addPadding={false}>
        <PartsList
          initialParts={partsWithUrls}
          initialTotalItems={partsResult.metadata.totalItems}
          fetchParts={loadArchivedPartsAction}
        />
      </Section>
    </DefaultPage>
  );
}

