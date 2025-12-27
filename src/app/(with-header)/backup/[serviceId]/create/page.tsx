import React from 'react';
import GeneratedForm from '@/components/universals/forms/generated/GeneratedForm.component';
import { BACKUP_CREATE_FORM } from '@/services/backup/backup.forms';

export const runtime = 'edge';

export default async function Create({ params }: { params: { serviceId: string } }) {
  return (
    <main>
      <h2>Neuen Backup Job anlegen</h2>
      <GeneratedForm
        definition={BACKUP_CREATE_FORM}
        context={{ service: { id: params.serviceId } }}
      />
    </main>
  )
}
