import Section from "@/components/universals/section/Section";
import { notFound } from "next/navigation";
import { partService } from "@/services/material-tracing/part.service";
import PartShortCodeConnectForm
  from "@/components/apps/material-tracing/short-code/part/PartShortCodeConnectForm.component";
import React from "react";
import {
  PartMaterialShortCodeConnectForm
} from "@/components/apps/material-tracing/short-code/part/PartMaterialShortCodeConnectForm.component";
import PartMaterialList from "@/components/apps/material-tracing/short-code/part/PartMaterialList.component";

export default async function Home({ params }: Readonly<{ params: Promise<{ partId: string; }> }>) {
  const part = await partService.getPart((await params).partId);
  if (!part) {
    return notFound();
  }

  const shortCodes = await partService.listShortCodes((await params).partId);
  const hasShortCode = shortCodes.length > 0;

  return (
    <main>
      <Section name="Informationen">
        Name: {part.name}<br />
        ExternalId: {part.externalId || '-'}
      </Section>
      {hasShortCode ? (
        <Section name="ShortCode">
          ShortCode: {shortCodes[0].code}
        </Section>
      ) : (
        <Section name="ShortCode verknüpfen">
          <PartShortCodeConnectForm
            args={{
              partId: part.id,
            }}
          />
        </Section>
      )}
      <Section name="Materials">
        <PartMaterialList
          partId={part.id}
        />
      </Section>
      <Section name="Material per ShortCode verbinden">
        <PartMaterialShortCodeConnectForm
          partId={part.id}
        />
      </Section>
    </main>
  );
}
