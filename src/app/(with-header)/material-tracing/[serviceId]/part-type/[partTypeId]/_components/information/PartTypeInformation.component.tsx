import React from 'react';
import Section from "@/components/universals/section/Section";
import type { TPartType } from "@/services/material-tracing/part-type.type";
import GeneratedForm from "@/components/universals/forms/generated/GeneratedForm.component";
import {
  buildPartTypeUpdateForm
} from "@/app/(with-header)/material-tracing/[serviceId]/part-type/[partTypeId]/_components/information/PartTypeInformation.form";
import { getCurrentServiceBaseConfiguration } from "@/utils/configuration.utils";
import { EServiceType } from "@/utils/configuration.type";

type PartTypeInformationProps = {
  partType: TPartType;
};

const PartTypeInformation: React.FunctionComponent<PartTypeInformationProps> = async ({
  partType,
}) => {
  const serviceConfiguration = await getCurrentServiceBaseConfiguration();
  const productOptions = serviceConfiguration.type === EServiceType.MATERIAL_TRACING
    ? serviceConfiguration.options?.product
    : undefined;

  return (
    <Section name="Informationen">
      <GeneratedForm
        key={JSON.stringify(partType)}
        definition={buildPartTypeUpdateForm(productOptions)}
        args={{
          partType,
        }}
      />
    </Section>
  );
};

export default PartTypeInformation;
