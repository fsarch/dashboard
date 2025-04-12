import React from 'react';
import { materialTypeService } from "@/services/material-tracing/material-type.service";
import { manufacturerService } from "@/services/material-tracing/manufacturer.service";
import { TMaterial } from "@/services/material-tracing/material.type";

type MaterialInfoProps = {
  material: TMaterial;
};

const MaterialInfo: React.FunctionComponent<MaterialInfoProps> = async ({
  material,
}) => {
  const materialType = await materialTypeService.getMaterialType(material.materialTypeId);
  const manufacturer = await manufacturerService.getManufacturer(materialType.manufacturerId);

  return (
    <div>
      Name: {material.name}<br />
      Material: {materialType.name}<br />
      Hersteller: {manufacturer.name}<br />
    </div>
  );
};

export default MaterialInfo;
