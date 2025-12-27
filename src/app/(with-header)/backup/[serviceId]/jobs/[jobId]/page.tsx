import React from 'react';
import BackupDetail from '@/components/apps/backup/BackupDetail';
import { getBackupJob } from '@/services/backup';

export default async function JobDetail({ params }: { params: { serviceId: string; jobId: string } }) {
  const job = await getBackupJob(params.serviceId, params.jobId);

  return (
    <main>
      <BackupDetail job={job} />
    </main>
  )
}

