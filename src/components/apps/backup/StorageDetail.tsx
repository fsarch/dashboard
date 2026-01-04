import React from 'react';
import Button from '@/components/universals/forms/Button';

type TStorage = any;

export default function StorageDetail({ storage }: { storage: TStorage }) {
  return (
    <div>
      <h2>Storage {storage.id}</h2>
      <pre>{JSON.stringify(storage, null, 2)}</pre>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button type="button">Edit</Button>
        <Button type="button">Delete</Button>
      </div>
    </div>
  )
}

