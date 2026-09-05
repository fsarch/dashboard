import { notFound } from "next/navigation";
import { functionService } from "@/services/function/function.service";
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";
import Editor from "../../_components/EditorDynamic.component";
import { customApiUtils } from "../../_components/editor-types/customApi.utils";
import styles from "../../page.module.scss";

type FunctionVersionPageProps = {
  params: Promise<{ serviceId: string; functionId: string; versionId: string }>;
};

export default async function FunctionVersionPage({ params }: FunctionVersionPageProps) {
  const { functionId, versionId } = await params;
  const functionVersions = await functionService.getFunctionVersions(functionId);
  const version = functionVersions.find((item) => item.id === versionId);

  if (!version) {
    return notFound();
  }

  const workerMeta = await functionService.getWorkerMeta();

  return (
    <DefaultPage
      className={styles.root}
    >
      <div className={styles.wrapper}>
        <Editor
          versionId={version.id}
          value={version.code}
          functionId={functionId}
          apiType={customApiUtils.generateApiTypes(workerMeta.api)}
          readOnly
        />
      </div>
    </DefaultPage>
  );
}
