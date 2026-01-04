import React from 'react';
import Button from '@/components/universals/forms/Button';

type TConnector = any;

export default function ConnectorDetail({ connector }: { connector: TConnector }) {
  return (
    <div>
      <h2>Connector {connector.id}</h2>
      <pre>{JSON.stringify(connector, null, 2)}</pre>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button type="button">Edit</Button>
        <Button type="button">Delete</Button>
      </div>
    </div>
  )
}

