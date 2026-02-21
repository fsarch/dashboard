import React from 'react';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import BackupDetailClient from '@/components/apps/backup/BackupDetailClient';
import { getBackup } from '@/services/backup';

export default async function BackupDetailPage({ params }: { params: Promise<{ backupId: string, serviceId: string }> }) {
  const { backupId, serviceId } = await params;

  const backup = await getBackup(backupId);

  return (
    <DefaultPage>
      {/* BackupDetailClient is a client component that handles actions like run/delete */}
      <BackupDetailClient backup={backup} serviceId={serviceId} />
    </DefaultPage>
  );
}

