import React from 'react';
import StorageList from '@/components/apps/backup/StorageList';
import { listStorages } from '@/services/backup';
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";

export default async function StoragesPage({ params }: { params: Promise<{ serviceId: string }> }) {
  const { serviceId } = await params;

  const storages = await listStorages(serviceId);

  return (
    <DefaultPage>
      <StorageList storages={storages.data} basePath={`/backup/${serviceId}`} />
    </DefaultPage>
  )
}

