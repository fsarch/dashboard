import React from 'react';
import Link from 'next/link';
import Button from '@/components/universals/forms/Button';
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";

type TConnector = any;

export default async function ConnectorList({ connectors }: { connectors: TConnector[]; }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Connectors</h2>
        <Link href={await getServiceLocalUrl('/connector/create')}>
          <Button type="button">Neuen Connector</Button>
        </Link>
      </div>
      <ul>
        {connectors.map(async (c:any) => (
          <li key={c.id}>
            <Link href={await getServiceLocalUrl('/connector/${c.id}')}>{c.id}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

