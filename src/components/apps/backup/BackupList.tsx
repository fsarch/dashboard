import React from 'react';
import Link from 'next/link';
import { TBackupJob } from '@/types/backup';
import Button from '@/components/universals/forms/Button';

type Props = {
  jobs: TBackupJob[];
  basePath?: string;
}

export default function BackupList({ jobs, basePath = '' }: Props) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Backup Jobs</h2>
        <Link href={`${basePath}/create`}>
          <Button type="button">Neuer Job</Button>
        </Link>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map(job => (
            <tr key={job.id}>
              <td>{job.id}</td>
              <td>{job.status}</td>
              <td>{job.createdAt}</td>
              <td>
                <Link href={`${basePath}/jobs/${job.id}`}>
                  <Button type="button">Anzeigen</Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
