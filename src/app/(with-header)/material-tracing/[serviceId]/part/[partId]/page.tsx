import Section from "@/components/universals/section/Section";
import { notFound } from "next/navigation";
import { partService } from "@/services/material-tracing/part.service";

export default async function Home({ params }: Readonly<{ params: Promise<{ partId: string; }> }>) {
  const part = await partService.getPart((await params).partId);
  if (!part) {
    return notFound();
  }

  return (
    <main>
      <Section name="Informationen">
        Name: {part.name}<br />
        ExternalId: {part.externalId || '-'}
      </Section>
    </main>
  );
}
