import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import DataTable from '@/components/apps/datatable/datatable/DataTable';
import { dataTableService } from '@/services/datatable/datatable.service';
import styles from './page.module.css';

export default async function Home(props: {
  params: Promise<{ dataTableId: string }>;
}) {
  const params = await props.params;
  const serviceId = (await headers()).get('X-Service-Id');
  const definition = await dataTableService.getDataTable(params.dataTableId);
  if (!definition) {
    return notFound();
  }

  return (
    <div className={styles.root}>
      <DataTable
        serviceId={serviceId as string}
        dataTableId={params.dataTableId}
        definition={definition}
      />
    </div>
  );
}
