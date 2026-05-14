import React from "react";
import Section from "@/components/universals/section/Section";
import { shortCodeService } from "@/services/material-tracing/short-code.service";
import MaterialShortCodeInfoComponent
  from "@/components/apps/material-tracing/short-code/material/MaterialShortCodeInfo.component";
import { EShortCodeType } from "@/services/material-tracing/short-code.type";
import PartShortCodeInfoComponent from "@/components/apps/material-tracing/short-code/part/PartShortCodeInfo.component";
import QrCodeDownloadButton from "@/components/universals/qr-code/QRCodeDownloadButton.component";
import { QRCodeType } from "@/components/universals/qr-code/QRCodeType.enum";
import { createAutomaticMetadata } from "@/utils/createAutomaticMetadata";
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";
import Actions from "@/app/(with-header)/material-tracing/[serviceId]/_components/actions/Actions.component";
import ShortCodeUpdateForm from "@/components/apps/material-tracing/short-code/ShortCodeUpdateForm.component";
import QRCode from "qrcode";

export const generateMetadata = createAutomaticMetadata();

export default async function Home({ params }: Readonly<{ params: Promise<{ shortCode: string; }> }>) {
  const shortCodeCode = (await params).shortCode;
  const shortCode = await shortCodeService.getShortCode(shortCodeCode);
  const qrCodeDataUrl = await QRCode.toDataURL(shortCodeCode, {
    margin: 1,
    width: 360,
  });

  return (
    <DefaultPage>
      <h1>{shortCode.code}</h1>

      <Section name="Informationen">
        <ShortCodeUpdateForm
          args={{
            shortCode
          }}
        />
      </Section>

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

      <Section name="QR-Code Vorschau">
        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrCodeDataUrl}
            alt={`QR-Code fuer ${shortCodeCode}`}
            style={{ width: 'min(320px, 100%)', height: 'auto', backgroundColor: '#ffffff', borderRadius: '8px', padding: '8px' }}
          />
          <div style={{ fontSize: '0.95rem', opacity: 0.9, wordBreak: 'break-all' }}>{shortCodeCode}</div>
        </div>
      </Section>

      <Section name="QR-Code herunterladen">
        <QrCodeDownloadButton
          type={QRCodeType.ROUND}
          value={shortCodeCode}
          open={false}
        >
          Download as PDF
        </QrCodeDownloadButton>
        <QrCodeDownloadButton
          type={QRCodeType.ROUND}
          value={shortCodeCode}
          open={true}
        >
          Show as PDF
        </QrCodeDownloadButton>
      </Section>
      <Actions
        type="short_code"
        basePath={`/v1/short-codes/${shortCode.code}`}
      />
    </DefaultPage>
  );
}
