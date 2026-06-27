import { functionService } from "@/services/function/function.service";
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";
import Editor from "./_components/EditorDynamic.component";
import styles from './page.module.scss';
import {
  customApiUtils
} from "./_components/editor-types/customApi.utils";

export default async function Home({ params }: { params: Promise<{ functionId: string; serviceId: string }> }) {
  const { functionId, serviceId } = await params;
  const functionVersions = await functionService.getFunctionVersions(functionId);
  const version = functionVersions.toSorted((a, b) => new Date(b.creationTime).getTime() - new Date(a.creationTime).getTime())?.[0];
  const workerMeta = await functionService.getWorkerMeta();

  return (
    <DefaultPage
      className={styles.root}
    >
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
