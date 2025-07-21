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
import Actions from "@/app/(with-header)/material-tracing/[serviceId]/_components/actions/Actions.component";
import MaterialUpdateForm from "@/components/apps/material-tracing/material/MaterialUpdateForm.component";

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
        <MaterialUpdateForm
          args={{
            material
          }}
        />
        <div style={{ marginTop: '1rem' }}>
          Material: {materialType.name}<br />
          Hersteller: {manufacturer.name}<br />
        </div>
      </Section>
      <Actions
        type="material"
        basePath={`/v1/materials/${material.id}`}
      />
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
