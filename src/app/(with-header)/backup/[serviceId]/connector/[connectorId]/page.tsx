import React from 'react';
import ConnectorDetail from '@/components/apps/backup/ConnectorDetail';
import { getConnector } from '@/services/backup';
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";

export default async function ConnectorDetailPage({ params }: { params: Promise<{ connectorId: string }> }) {
  const { connectorId } = await params;

  const connector = await getConnector(connectorId);

  return (
    <DefaultPage>
      <ConnectorDetail connector={connector} />
    </DefaultPage>
  )
}

