'use client';

import React, { useState } from 'react';
import Button from '@/components/universals/forms/Button';
import type { TBackup } from '@/services/backup/backup';

type Props = {
  backup: TBackup;
  serviceId: string;
}

export default function BackupDetailClient({ backup, serviceId }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleRunNow() {

  }

  async function handleDelete() {

  }

  return (
    <div>
      <h2>Backup {backup.name ?? backup.id}</h2>
      <p>Connector Service: {backup.connectorServiceId}</p>
      <p>Storage: {backup.storageId}</p>
      <pre style={{ background: '#f7f7f7', padding: 12 }}>{JSON.stringify(backup, null, 2)}</pre>
      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <Button type="button" onClick={handleRunNow} disabled={loading}>Run Now</Button>
        <Button type="button" onClick={handleDelete} disabled={loading}>Delete</Button>
      </div>
    </div>
  );
}
