import { materialService } from "@/services/material-tracing/material.service";
import Section from "@/components/universals/section/Section";
import { materialTypeService } from "@/services/material-tracing/material-type.service";
import { manufacturerService } from "@/services/material-tracing/manufacturer.service";
import MaterialShortCodeConnectForm
  from "@/components/apps/material-tracing/short-code/MaterialShortCodeConnectForm.component";

export default async function Home(props: { params: Promise<{ materialId: string }> }) {
  const params = await props.params;
  const material = await materialService.getMaterial(await params.materialId);
  const materialType = await materialTypeService.getMaterialType(material.materialTypeId);
  const manufacturer = await manufacturerService.getManufacturer(materialType.manufacturerId);

  return (
    <main>
      <pre>
        {JSON.stringify(material, null, 2)}
      </pre>

      <Section name="Informationen">
        Name: {material.name}<br />
        Material: {materialType.name}<br />
        Hersteller: {manufacturer.name}<br />
      </Section>
      <Section name="ShortCode verknüpfen">
        <MaterialShortCodeConnectForm
          args={{
            materialId: material.id,
          }}
        />
      </Section>
    </main>
  );
}
