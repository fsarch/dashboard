import React from "react";
import Section from "@/components/universals/section/Section";
import { shortCodeService } from "@/services/material-tracing/short-code.service";
import MaterialShortCodeInfoComponent
  from "@/components/apps/material-tracing/short-code/material/MaterialShortCodeInfo.component";
import { EShortCodeType } from "@/services/material-tracing/short-code.type";
import PartShortCodeInfoComponent from "@/components/apps/material-tracing/short-code/part/PartShortCodeInfo.component";
import QrCodeDownloadButton from "@/components/universals/qr-code/QRCodeDownloadButton.component";
import { QRCodeType } from "@/components/universals/qr-code/QRCodeType.enum";

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
      {shortCode.shortCodeTypeId === EShortCodeType.PART ? (
        <PartShortCodeInfoComponent
          code={shortCodeCode}
        />
      ) : null}

      <Section name="ShortCode herunterladen">
        <QrCodeDownloadButton
          type={QRCodeType.ROUND}
          value={shortCodeCode}
          open={false}
        >
          Download
        </QrCodeDownloadButton>
        <QrCodeDownloadButton
          type={QRCodeType.ROUND}
          value={shortCodeCode}
          open={true}
        >
          Show
        </QrCodeDownloadButton>
      </Section>
    </main>
  );
}
