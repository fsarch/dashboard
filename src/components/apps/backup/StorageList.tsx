import React from 'react';
import Link from 'next/link';
import Button from '@/components/universals/forms/Button';

type TStorage = any;

export default function StorageList({ storages, basePath }: { storages: TStorage[]; basePath?: string }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Storages</h2>
        <Link href={`${basePath}/storage/create`}>
          <Button type="button">Neue Storage</Button>
        </Link>
      </div>
      <ul>
        {storages.map((s:any) => (
          <li key={s.id}>
            <Link href={`${basePath}/storage/${s.id}`}>{s.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

