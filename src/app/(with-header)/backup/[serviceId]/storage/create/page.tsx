import React from 'react';
import GeneratedForm from '@/components/universals/forms/generated/GeneratedForm.component';
import { STORAGE_CREATE_FORM } from '@/services/backup/storage.forms';
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";

export default async function CreateStorage({ params }: { params: Promise<{ serviceId: string }> }) {
  return (
    <DefaultPage>
      <h2>Neue Storage anlegen</h2>
      <GeneratedForm definition={STORAGE_CREATE_FORM} />
    </DefaultPage>
  )
}

