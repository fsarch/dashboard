import React from 'react';
import BackupDetail from '@/components/apps/backup/BackupDetail';
import { getBackupJob } from '@/services/backup';
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";

export default async function JobDetail({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params;

  const job = await getBackupJob(jobId);

  return (
    <DefaultPage>
      <BackupDetail job={job} />
    </DefaultPage>
  )
}

