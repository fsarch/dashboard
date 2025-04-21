import Section from "@/components/universals/section/Section";
import { partTypeService } from "@/services/material-tracing/part-type.service";
import { notFound } from "next/navigation";

export default async function Home({ params }: Readonly<{ params: Promise<{ partTypeId: string; }> }>) {
  const partType = await partTypeService.getPartType((await params).partTypeId);
  if (!partType) {
    return notFound();
  }

  return (
    <main>
      <Section name="Informationen">
        Name: {partType.name}<br />
        ExternalId: {partType.externalId || '-'}
      </Section>
    </main>
  );
}
