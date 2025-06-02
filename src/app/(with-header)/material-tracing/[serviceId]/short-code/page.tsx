import { shortCodeService } from "@/services/material-tracing/short-code.service";
import List from "@/components/universals/list/List";
import ListItem from "@/components/universals/list/ListItem";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import Link from "next/link";
import React from "react";
import Section from "@/components/universals/section/Section";
import { ShortCodeCreateForm } from "@/components/apps/material-tracing/short-code/ShortCodeCreateForm.component";
import { createAutomaticMetadata } from "@/utils/createAutomaticMetadata";
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";

export const generateMetadata = createAutomaticMetadata();

export default async function Home() {
  const shortCodes = await shortCodeService.listShortCodes();

  return (
    <DefaultPage>
      <Section name="Short Codes">
        <List>
          {shortCodes.map(async (shortCode) => (
            <Link
              key={shortCode.id}
              href={await getServiceLocalUrl(`/short-code/${shortCode.code}`)}
            >
              <ListItem>
                <div>
                  {shortCode.code}
                </div>
              </ListItem>
            </Link>
          ))}
        </List>
      </Section>
      <Section name="Short Code erstellen">
        <ShortCodeCreateForm/>
      </Section>
    </DefaultPage>
  );
}
