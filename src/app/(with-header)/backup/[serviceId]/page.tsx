import React from 'react';
import { listBackupJobs } from '@/services/backup';
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";

export default async function ServiceHome({ params }: { params: { serviceId: string } }) {
  const jobs = await listBackupJobs(params.serviceId);

  return (
    <DefaultPage>
      Test
    </DefaultPage>
  )
}

