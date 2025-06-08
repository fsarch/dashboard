import { materialService } from "@/services/material-tracing/material.service";
import Section from "@/components/universals/section/Section";
import { materialTypeService } from "@/services/material-tracing/material-type.service";
import { manufacturerService } from "@/services/material-tracing/manufacturer.service";
import MaterialShortCodeConnectForm
  from "@/components/apps/material-tracing/short-code/material/MaterialShortCodeConnectForm.component";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import MaterialRemove
  from "@/app/(with-header)/material-tracing/[serviceId]/material/[materialId]/_components/remove/MaterialRemove.component";
import { createAutomaticMetadata } from "@/utils/createAutomaticMetadata";
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";
import GeneratedForm from "@/components/universals/forms/generated/GeneratedForm.component";
import { MATERIAL_CHECKOUT_FORM } from "@/components/apps/material-tracing/material/MaterialCheckout.form";
import { datetimeUtils } from "@/utils/datetime.utils";
import MaterialShortCodeDeleteForm
  from "@/components/apps/material-tracing/short-code/material/MaterialShortCodeDeleteForm.component";
import React from "react";

export const generateMetadata = createAutomaticMetadata();

export default async function Home(props: { params: Promise<{ materialId: string }> }) {
  const params = await props.params;
  const material = await materialService.getMaterial(await params.materialId);
  const materialType = await materialTypeService.getMaterialType(material.materialTypeId);
  const manufacturer = await manufacturerService.getManufacturer(materialType.manufacturerId);
  const shortCodes = await materialService.listShortCodes(await params.materialId);
  const hasShortCode = shortCodes.length > 0;

  return (
    <DefaultPage>
      <Section name="Informationen">
        Name: {material.name}<br />
        Material: {materialType.name}<br />
        Hersteller: {manufacturer.name}<br />
      </Section>
      <Section name="Material ausbuchen">
        {material.checkoutTime ? (
          <div>
            Das Material wurde bereits am <b>{datetimeUtils.formatDate(material.checkoutTime)}</b> ausgebucht.
          </div>
        ) : (
          <GeneratedForm
            definition={MATERIAL_CHECKOUT_FORM}
            args={{
              materialId: material.id,
            }}
          />
        )}
      </Section>
      {hasShortCode ? (
        <Section name="ShortCode">
          ShortCode: {shortCodes[0].code}

          <MaterialShortCodeDeleteForm
            args={{
              materialId: material.id,
              shortCode: shortCodes[0].code,
            }}
          />
        </Section>
      ) : (
        <Section name="ShortCode verknüpfen">
          <MaterialShortCodeConnectForm
            args={{
              materialId: material.id,
            }}
          />
        </Section>
      )}

      <MaterialRemove
        materialId={material.id}
        homeUrl={await getServiceLocalUrl('/material')}
      />
    </DefaultPage>
  );
}
