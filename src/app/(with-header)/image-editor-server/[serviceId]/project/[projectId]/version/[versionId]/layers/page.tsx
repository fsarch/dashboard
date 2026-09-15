import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import Link from 'next/link';
import { getServiceLocalUrl } from '@/utils/getServiceLocalUrl';
import { imageEditorServerService } from '@/services/image-editor-server/image-editor-server.service';
import LayerCanvasEditor from './_components/LayerCanvasEditor.component';

export default async function LayersPage({
  params,
}: {
  params: Promise<{ serviceId: string; projectId: string; versionId: string }>;
}) {
  const { projectId, versionId } = await params;

  const [version, versions, parameters, layers] = await Promise.all([
    imageEditorServerService.getProjectVersion(projectId, versionId),
    imageEditorServerService.listProjectVersions(projectId),
    imageEditorServerService.listParameters(projectId, versionId),
    imageEditorServerService.listLayers(projectId, versionId),
  ]);

  // Mirrors the backend's edit-lock rule - see version/[versionId]/page.tsx.
  const isEditable = versions[0]?.id === versionId && !version.isActive;

  return (
    <DefaultPage>
      <Section name="Ebenen">
        <p>
          <Link href={await getServiceLocalUrl(`/project/${projectId}/version/${versionId}`)}>
            &larr; Zurück zur Version
          </Link>
        </p>
      </Section>

      <LayerCanvasEditor
        projectId={projectId}
        versionId={versionId}
        version={{ width: version.width, height: version.height }}
        isEditable={isEditable}
        initialLayers={layers}
        parameters={parameters}
      />
    </DefaultPage>
  );
}
