import { functionService } from "@/services/function/function.service";
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";
import Editor from "@/app/(with-header)/function/[serviceId]/function/[functionId]/_components/Editor.component";

export default async function Home({ params }: { params: Promise<{ functionId: string }> }) {
  const functionId = (await params).functionId;
  const functionVersions = await functionService.getFunctionVersions(functionId);
  const version = functionVersions.toSorted((a, b) => new Date(b.creationTime).getTime() - new Date(a.creationTime).getTime())?.[0];

  return (
    <DefaultPage>
      <Editor
        versionId={version?.id}
        value={version?.code ?? ''}
        functionId={functionId}
      />
    </DefaultPage>
  );
}
