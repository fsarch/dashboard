import { shortCodeService } from "@/services/material-tracing/short-code.service";
import List from "@/components/universals/list/List";
import ListItem from "@/components/universals/list/ListItem";
import React from "react";
import Section from "@/components/universals/section/Section";
import { createAutomaticMetadata } from "@/utils/createAutomaticMetadata";
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";
import ShortCodeTypeBadge from "@/components/apps/material-tracing/short-code/badge/short-code-type-badge.component";
import BatchExportForm from "@/components/apps/material-tracing/short-code/batch-export/batch-export-form.component";
import BatchExportCheckbox
  from "@/components/apps/material-tracing/short-code/batch-export/batch-export-checkbox.component";
import FormikSubmitButton from "@/components/universals/forms/FormikSubmitButton.component";

export const generateMetadata = createAutomaticMetadata();

export default async function Home() {
  const shortCodes = await shortCodeService.listShortCodes();

  return (
    <DefaultPage>
      <Section name="Short Codes">
        <BatchExportForm>
          <List>
            {shortCodes.map((shortCode) => (
              <label
                key={shortCode.id}
              >
                <ListItem
                  left={<BatchExportCheckbox code={shortCode.code} />}
                  right={<ShortCodeTypeBadge type={shortCode.shortCodeTypeId} />}
                >
                  <div>
                    {shortCode.code}
                  </div>
                </ListItem>
              </label>
            ))}
          </List>
          <FormikSubmitButton>
            Exportieren
          </FormikSubmitButton>
        </BatchExportForm>
      </Section>
    </DefaultPage>
  );
}
