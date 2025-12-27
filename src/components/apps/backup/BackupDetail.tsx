import React from 'react';
import Button from '@/components/universals/forms/Button';
import { TBackupJob } from '@/types/backup';

type Props = {
  job: TBackupJob;
}

export default function BackupDetail({ job }: Props) {
  return (
    <div>
      <h2>Backup Job {job.id}</h2>
      <p>Status: {job.status}</p>
      <pre style={{ background: '#f7f7f7', padding: 12 }}>{JSON.stringify(job, null, 2)}</pre>
      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <Button type="button">Retry</Button>
        <Button type="button">Delete</Button>
      </div>
    </div>
  )
}
