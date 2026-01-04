import React from 'react';
import GeneratedForm from '@/components/universals/forms/generated/GeneratedForm.component';
import { CONNECTOR_CREATE_FORM } from '@/services/backup/connector.forms';
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";

export default async function CreateConnector({ params }: { params: { serviceId: string } }) {
  return (
    <DefaultPage>
      <h2>Neuen Connector anlegen</h2>
      <GeneratedForm definition={CONNECTOR_CREATE_FORM} />
    </DefaultPage>
  )
}

