import React from "react";
import Section from "@/components/universals/section/Section";
import { shortCodeService } from "@/services/material-tracing/short-code.service";
import MaterialShortCodeInfoComponent
  from "@/components/apps/material-tracing/short-code/material/MaterialShortCodeInfo.component";
import { EShortCodeType } from "@/services/material-tracing/short-code.type";

export default async function Home({ params }: Readonly<{ params: Promise<{ shortCode: string; }> }>) {
  const shortCodeCode = (await params).shortCode;
  const shortCode = await shortCodeService.getShortCode(shortCodeCode);

  return (
    <main>
      <h1>{shortCode.code}</h1>
      {shortCode.shortCodeTypeId === EShortCodeType.MATERIAL ? (
        <MaterialShortCodeInfoComponent
          code={shortCodeCode}
        />
      ) : null}
      <Section name="Material entfernen">

      </Section>
    </main>
  );
}
