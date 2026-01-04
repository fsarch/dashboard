import React from 'react';
import ConnectorList from '@/components/apps/backup/ConnectorList';
import { listConnectors } from '@/services/backup';
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";

export default async function ConnectorsPage({ params }: { params: Promise<{ serviceId: string }> }) {
  const { serviceId } = await params;

  const connectors = await listConnectors(serviceId);

  return (
    <DefaultPage>
      <ConnectorList connectors={connectors.data} />
    </DefaultPage>
  )
}

