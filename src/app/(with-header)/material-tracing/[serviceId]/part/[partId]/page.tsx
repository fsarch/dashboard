import Section from "@/components/universals/section/Section";
import { notFound } from "next/navigation";
import { partService } from "@/services/material-tracing/part.service";
import PartShortCodeConnectForm
  from "@/components/apps/material-tracing/short-code/part/PartShortCodeConnectForm.component";
import React from "react";
import {
  PartMaterialShortCodeConnectForm
} from "@/components/apps/material-tracing/short-code/part/PartMaterialShortCodeConnectForm.component";
import PartMaterialList from "@/components/apps/material-tracing/short-code/part/part-material/PartMaterialList.component";
import {
  PartPartShortCodeConnectForm
} from "@/components/apps/material-tracing/short-code/part/PartPartShortCodeConnectForm.component";
import {
  PartPartIdConnectForm
} from "@/components/apps/material-tracing/part/PartPartIdConnectForm.component";
import PartChildrenList from "@/components/apps/material-tracing/short-code/part/part-children/PartChildrenList.component";
import PartUpdateForm from "@/components/apps/material-tracing/part/PartInfoForm.component";
import PartRemove
  from "@/app/(with-header)/material-tracing/[serviceId]/part/[partId]/_components/remove/PartRemove.component";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import { createAutomaticMetadata } from "@/utils/createAutomaticMetadata";
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";
import PartShortCodeDeleteForm
  from "@/components/apps/material-tracing/short-code/part/PartShortCodeDeleteForm.component";
import Actions from "@/app/(with-header)/material-tracing/[serviceId]/_components/actions/Actions.component";
import ShortCodeLinkedCard from "@/components/apps/material-tracing/short-code/ShortCodeLinkedCard.component";
import { partTypeService } from "@/services/material-tracing/part-type.service";
import TypeLinkedCard from "@/components/apps/material-tracing/TypeLinkedCard.component";
import Fieldset from "@/components/universals/forms/Fieldset.component";
import FieldsetRow from "@/components/universals/forms/FieldsetRow.component";

export const generateMetadata = createAutomaticMetadata();

export default async function Home({ params }: Readonly<{ params: Promise<{ partId: string; }> }>) {
  const part = await partService.getPart((await params).partId);
  if (!part) {
    return notFound();
  }

  const shortCodes = await partService.listShortCodes((await params).partId);
  const hasShortCode = shortCodes.length > 0;
  const partType = await partTypeService.getPartType(part.partTypeId);

  return (
    <DefaultPage>
      <Section name="Informationen">
        <PartUpdateForm
          args={{
            part
          }}
        />
        <div style={{ marginTop: '1rem' }}>
          <Fieldset>
            <FieldsetRow label="Parttype">
              {partType ? (
                <TypeLinkedCard
                  name={partType.name}
                  path={`/part-type/${partType.id}`}
                />
              ) : (
                <div>Parttyp-ID: {part.partTypeId}</div>
              )}
            </FieldsetRow>
          </Fieldset>
        </div>
      </Section>
      {hasShortCode ? (
        <Section name="ShortCode">
          <ShortCodeLinkedCard code={shortCodes[0].code} label="Verknüpfter ShortCode" />

          <PartShortCodeDeleteForm
            args={{
              partId: part.id,
              shortCode: shortCodes[0].code,
            }}
          />
        </Section>
      ) : (
        <Section name="ShortCode verknüpfen">
          <PartShortCodeConnectForm
            args={{
              partId: part.id,
            }}
          />
        </Section>
      )}
      <Section name="Materials">
        <PartMaterialList
          partId={part.id}
        />
      </Section>
      <Section name="Material per ShortCode verbinden">
        <PartMaterialShortCodeConnectForm
          partId={part.id}
        />
      </Section>
      <Section name="Parts">
        <PartChildrenList
          partId={part.id}
        />
      </Section>
      <Section name="Part per ShortCode verbinden">
        <PartPartShortCodeConnectForm
          partId={part.id}
        />
      </Section>
      <Section name="Part per ID verbinden">
        <PartPartIdConnectForm
          partId={part.id}
        />
      </Section>
      <Actions
        type="part"
        basePath={`/v1/parts/${part.id}`}
      />
      <PartRemove
        partId={part.id}
        homeUrl={await getServiceLocalUrl('/part')}
      />
    </DefaultPage>
  );
}
