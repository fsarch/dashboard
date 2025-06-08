import React from 'react';
import Section from "@/components/universals/section/Section";
import PartShortCodeDeleteForm
  from "@/components/apps/material-tracing/short-code/part/PartShortCodeDeleteForm.component";
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
        <>
          <Section name="Informationen">
          </Section>
          <Section name="Connected Part">
            <PartShortCodeDeleteForm
              args={{
                partId: part.id,
                shortCode: code,
              }}
            />
          </Section>
        </>
      ) : undefined}
    </>
  );
};

export default PartShortCodeInfoComponent;
