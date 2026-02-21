import React from 'react';
import GeneratedForm from '@/components/universals/forms/generated/GeneratedForm.component';
import { BACKUP_CREATE_FORM } from '@/services/backup/backup.forms';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';

export default async function BackupCreatePage({ params }: { params: Promise<{ serviceId: string }> }) {
  return (
    <DefaultPage>
      {/* GeneratedForm handles its own data sources and post actions (redirect) */}
      <GeneratedForm definition={BACKUP_CREATE_FORM} />
    </DefaultPage>
  );
}

