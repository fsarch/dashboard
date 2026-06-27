'use client';

import React from 'react';
import { ExecutionListDto } from '@/services/function/function.type';
import List from '@/components/universals/list/List';
import ListItem from '@/components/universals/list/ListItem';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type ExecutionsListProps = {
  executions: ExecutionListDto[];
  functionId: string;
  serviceId: string;
};

const ExecutionsList: React.FunctionComponent<ExecutionsListProps> = ({
  executions,
  functionId,
  serviceId
}) => {
  const router = useRouter();

  if (executions.length === 0) {
    return <p>Keine Executions gefunden.</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ border: '1px solid var(--color-border)', borderRadius: '8px', padding: '1rem' }}>
        <List>
          {executions.map((execution) => (
            <Link
              key={execution.id}
              href={`/function/${serviceId}/function/${functionId}/executions/${execution.id}`}
              passHref
            >
              <ListItem>
                <strong>Execution ID: {execution.id}</strong>
                <br />
                <small>
                  Status: {execution.isSuccess ? '✓ Success' : '✗ Failed'} | 
                  Created: {new Date(execution.creationTime).toLocaleString()}
                </small>
              </ListItem>
            </Link>
          ))}
        </List>
      </div>
    </div>
  );
};

export default ExecutionsList;
