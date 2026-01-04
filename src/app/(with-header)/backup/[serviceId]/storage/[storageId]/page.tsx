import React from 'react';
import StorageDetail from '@/components/apps/backup/StorageDetail';
import { getStorage } from '@/services/backup';
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";

export default async function StorageDetailPage({ params }: { params: Promise<{ serviceId: string; storageId: string }> }) {
  const { serviceId, storageId } = await params;
  const storage = await getStorage(serviceId, storageId);

  return (
    <DefaultPage>
      <StorageDetail storage={storage} />
    </DefaultPage>
  )
}

