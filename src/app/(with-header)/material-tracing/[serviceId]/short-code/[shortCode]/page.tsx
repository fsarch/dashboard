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
import ShortCodeCopyButton from "@/components/apps/material-tracing/short-code/ShortCodeCopyButton.component";
import QRCode from "qrcode";
import styles from './page.module.scss';

export const generateMetadata = createAutomaticMetadata();

export default async function Home({ params }: Readonly<{ params: Promise<{ shortCode: string; }> }>) {
  const shortCodeCode = (await params).shortCode;
  const shortCode = await shortCodeService.getShortCode(shortCodeCode);
  const qrCodeDataUrl = await QRCode.toDataURL(shortCodeCode, {
    margin: 1,
    width: 720,
  });

  return (
    <DefaultPage>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>{shortCode.code}</h1>
        <ShortCodeCopyButton value={shortCodeCode} />
      </div>

      <Section name="ShortCode">
        <div className={styles.topSectionContent}>
          <div className={styles.preview}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrCodeDataUrl}
              alt={`QR-Code fuer ${shortCodeCode}`}
              className={styles.previewImage}
            />
            <div className={styles.previewCode}>{shortCodeCode}</div>
          </div>

          <div className={styles.updateFormWrapper}>
            <ShortCodeUpdateForm
              args={{
                shortCode
              }}
            />
          </div>

          <div className={styles.downloadActions}>
            <QrCodeDownloadButton
              type={QRCodeType.ROUND}
              value={shortCodeCode}
              open={false}
            >
              Als PDF herunterladen
            </QrCodeDownloadButton>
            <QrCodeDownloadButton
              type={QRCodeType.ROUND}
              value={shortCodeCode}
              open={true}
            >
              Als PDF anzeigen
            </QrCodeDownloadButton>
          </div>
        </div>
      </Section>

      <Section name="Verbundene Informationen">
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
      </Section>
      <Actions
        type="short_code"
        basePath={`/v1/short-codes/${shortCode.code}`}
      />
    </DefaultPage>
  );
}
