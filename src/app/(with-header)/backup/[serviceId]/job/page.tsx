import React from 'react';
import BackupList from '@/components/apps/backup/BackupList';
import { listBackupJobs } from '@/services/backup';
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";

export default async function ServiceHome({ params }: { params: Promise<{ serviceId: string }> }) {
  const { serviceId } = await params;

  const jobs = await listBackupJobs(serviceId);

  return (
    <DefaultPage>
      <BackupList jobs={jobs.data} basePath={`/backup/${serviceId}`} />
    </DefaultPage>
  )
}

