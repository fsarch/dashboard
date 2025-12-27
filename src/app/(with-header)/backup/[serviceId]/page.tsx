import React from 'react';
import BackupList from '@/components/apps/backup/BackupList';
import { listBackupJobs } from '@/services/backup';
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";

export default async function ServiceHome({ params }: { params: { serviceId: string } }) {
  const jobs = await listBackupJobs(params.serviceId);

  return (
    <DefaultPage>
      <BackupList jobs={jobs} basePath={`/backup/${params.serviceId}`} />
    </DefaultPage>
  )
}

