import React from 'react';
import GeneratedForm from '@/components/universals/forms/generated/GeneratedForm.component';
import { BACKUP_JOB_CREATE_FORM } from '@/services/backup/backup.forms';
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";

export default async function Create({ params }: { params: { serviceId: string } }) {
  return (
    <DefaultPage>
      <h2>Neuen Backup Job anlegen</h2>
      <GeneratedForm
        definition={BACKUP_JOB_CREATE_FORM}
      />
    </DefaultPage>
  )
}
