import React from 'react';
import { materialService } from "@/services/material-tracing/material.service";
import { materialTypeService } from "@/services/material-tracing/material-type.service";
import { manufacturerService } from "@/services/material-tracing/manufacturer.service";
import Section from "@/components/universals/section/Section";
import MaterialShortCodeDeleteForm
  from "@/components/apps/material-tracing/short-code/material/MaterialShortCodeDeleteForm.component";
import MaterialInfo from "@/components/apps/material-tracing/material/MaterialInfo.component";
import QrCodeDownloadButton from "@/components/universals/qr-code/QRCodeDownloadButton.component";
import { QRCodeType } from "@/components/universals/qr-code/QRCodeType.enum";

type MaterialShortCodeInfoComponentProps = {
  code: string;
};

const MaterialShortCodeInfoComponent: React.FunctionComponent<MaterialShortCodeInfoComponentProps> = async ({
  code,
}) => {
  const materials = await materialService.listMaterialsByShortCode(code);
  const material = materials[0];

  return (
    <>
      {material ? (
        <Section name="Informationen">
          <MaterialInfo
            material={material}
          />
        </Section>
      ) : undefined}
      <Section name="ShortCode herunterladen">
        <QrCodeDownloadButton
          type={QRCodeType.ROUND}
          value={code}
          open={false}
        >
          Download
        </QrCodeDownloadButton>
        <QrCodeDownloadButton
          type={QRCodeType.ROUND}
          value={code}
          open={true}
        >
          Show
        </QrCodeDownloadButton>
      </Section>
      <Section name="Material auschecken">
        {/* TODO */}
      </Section>
      {material ? (
        <Section name="Verbindung aufheben">
          <MaterialShortCodeDeleteForm
            args={{
              materialId: material.id,
              shortCode: code,
            }}
          />
        </Section>
      ) : undefined}
    </>
  );
};

export default MaterialShortCodeInfoComponent;
