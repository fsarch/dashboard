import Link from 'next/link';
import React from 'react';
import ShortCodeTypeBadge from '@/components/apps/material-tracing/short-code/badge/short-code-type-badge.component';
import BatchCreateForm from '@/components/apps/material-tracing/short-code/batch-create/batch-create-form.component';
import { ShortCodeCreateForm } from '@/components/apps/material-tracing/short-code/ShortCodeCreateForm.component';
import Button from '@/components/universals/forms/Button';
import FormikSubmitButton from '@/components/universals/forms/FormikSubmitButton.component';
import SearchInput from '@/components/universals/forms/SearchInput.component';
import LinkListItem from '@/components/universals/list/LinkListItem';
import List from '@/components/universals/list/List';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import { shortCodeService } from '@/services/material-tracing/short-code.service';
import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
import { getServiceLocalUrl } from '@/utils/getServiceLocalUrl';

export const generateMetadata = createAutomaticMetadata();

export default async function Home({
  searchParams,
}: Readonly<{ searchParams: Promise<Record<string, string>> }>) {
  const params = await searchParams;
  const search = params.search;

  const shortCodesResult = await shortCodeService.listShortCodes({
    search,
    skip: 0,
    take: 1000,
  });

  return (
    <DefaultPage>
      <Section name="Short Code erstellen">
        <ShortCodeCreateForm />
      </Section>

      <Section name="Batch erstellen">
        <BatchCreateForm>
          <FormikSubmitButton>Batch erstellen</FormikSubmitButton>
        </BatchCreateForm>
      </Section>

      <Section name="Exporte">
        <Link href={await getServiceLocalUrl('/short-code/batch-export')}>
          <Button type="button">Batch-Export</Button>
        </Link>
      </Section>
      <Section name="Short Codes">
        <SearchInput />
        <List>
          {shortCodesResult.data.map(async (shortCode) => (
            <LinkListItem
              key={shortCode.id}
              href={await getServiceLocalUrl(`/short-code/${shortCode.code}`)}
              right={<ShortCodeTypeBadge type={shortCode.shortCodeTypeId} />}
            >
              <div>{shortCode.code}</div>
            </LinkListItem>
          ))}
        </List>
      </Section>
    </DefaultPage>
  );
}
