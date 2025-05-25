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
import { partService } from "@/services/material-tracing/part.service";

type PartShortCodeInfoComponentProps = {
  code: string;
};

const PartShortCodeInfoComponent: React.FunctionComponent<PartShortCodeInfoComponentProps> = async ({
  code,
}) => {
  const parts = await partService.listPartsByShortCode(code);
  const part = parts[0];

  return (
    <>
      {part ? (
        <Section name="Informationen">
        </Section>
      ) : undefined}
    </>
  );
};

export default PartShortCodeInfoComponent;
