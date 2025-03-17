import React from 'react';
import { materialService } from "@/services/material-tracing/material.service";
import { materialTypeService } from "@/services/material-tracing/material-type.service";
import { manufacturerService } from "@/services/material-tracing/manufacturer.service";
import Section from "@/components/universals/section/Section";
import MaterialShortCodeDeleteForm
  from "@/components/apps/material-tracing/short-code/material/MaterialShortCodeDeleteForm.component";

type MaterialShortCodeInfoComponentProps = {
  code: string;
};

const MaterialShortCodeInfoComponent: React.FunctionComponent<MaterialShortCodeInfoComponentProps> = async ({
  code,
}) => {
  const materials = await materialService.listMaterialsByShortCode(code);
  const material = materials[0];
  const materialType = await materialTypeService.getMaterialType(material.materialTypeId);
  const manufacturer = await manufacturerService.getManufacturer(materialType.manufacturerId);

  return (
    <>
      <Section name="Informationen">
        Name: {material.name}<br />
        Material: {materialType.name}<br />
        Hersteller: {manufacturer.name}<br />
      </Section>
      <Section name="Material auschecken">
        {/* TODO */}
      </Section>
      <Section name="Verbindung aufheben">
        <MaterialShortCodeDeleteForm
          args={{
            materialId: material.id,
            shortCode: code,
          }}
        />
      </Section>
    </>
  );
};

export default MaterialShortCodeInfoComponent;
