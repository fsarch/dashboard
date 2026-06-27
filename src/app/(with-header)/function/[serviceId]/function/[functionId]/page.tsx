import { functionService } from "@/services/function/function.service";
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";
import Editor from "./_components/EditorDynamic.component";
import styles from './page.module.scss';
import {
  customApiUtils
} from "./_components/editor-types/customApi.utils";
import Link from "next/link";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";

export default async function Home({ params }: { params: Promise<{ functionId: string; serviceId: string }> }) {
  const { functionId, serviceId } = await params;
  const functionVersions = await functionService.getFunctionVersions(functionId);
  const version = functionVersions.toSorted((a, b) => new Date(b.creationTime).getTime() - new Date(a.creationTime).getTime())?.[0];
  const workerMeta = await functionService.getWorkerMeta();

  return (
    <DefaultPage
      className={styles.root}
    >
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <Link
          href={await getServiceLocalUrl(`/function/${functionId}`)}
          style={{ 
            padding: '0.5rem 1rem', 
            textDecoration: 'none',
            background: 'var(--color-background)',
            borderRadius: '4px'
          }}
        >
          Code
        </Link>
        <Link
          href={await getServiceLocalUrl(`/function/${functionId}/settings`)}
          style={{ 
            padding: '0.5rem 1rem', 
            textDecoration: 'none',
            background: 'var(--color-background)',
            borderRadius: '4px'
          }}
        >
          Einstellungen
        </Link>
        <Link
          href={await getServiceLocalUrl(`/function/${functionId}/executions`)}
          style={{ 
            padding: '0.5rem 1rem', 
            textDecoration: 'none',
            background: 'var(--color-background)',
            borderRadius: '4px'
          }}
        >
          Executions
        </Link>
      </div>
      
      <div className={styles.wrapper}>
        <Editor
          versionId={version?.id}
          value={version?.code ?? ''}
          functionId={functionId}
          apiType={customApiUtils.generateApiTypes(workerMeta.api)}
        />
      </div>
    </DefaultPage>
  );
}
