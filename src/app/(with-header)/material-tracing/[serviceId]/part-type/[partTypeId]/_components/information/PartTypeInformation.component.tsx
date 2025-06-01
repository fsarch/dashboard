import React from 'react';
import Section from "@/components/universals/section/Section";
import type { TPartType } from "@/services/material-tracing/part-type.type";
import GeneratedForm from "@/components/universals/forms/generated/GeneratedForm.component";
import {
  PART_TYPE_UPDATE_FORM
} from "@/app/(with-header)/material-tracing/[serviceId]/part-type/[partTypeId]/_components/information/PartTypeInformation.form";

type PartTypeInformationProps = {
  partType: TPartType;
};

const PartTypeInformation: React.FunctionComponent<PartTypeInformationProps> = ({
  partType,
}) => {
  return (
    <Section name="Informationen">
      <GeneratedForm
        key={JSON.stringify(partType)}
        definition={PART_TYPE_UPDATE_FORM}
        args={{
          partType,
        }}
      />
    </Section>
  );
};

export default PartTypeInformation;
