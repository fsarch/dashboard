import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import Link from 'next/link';
import { getServiceLocalUrl } from '@/utils/getServiceLocalUrl';
import { colors } from '@/app/_styles/colors';
import Badge from '@/components/universals/badge/badge.component';
import UpdateVersionForm from './_components/UpdateVersionForm.component';
import ActivateVersionButton from './_components/ActivateVersionButton.component';
import RenderPreview from './_components/RenderPreview.component';
import { imageEditorServerService } from '@/services/image-editor-server/image-editor-server.service';

export default async function VersionDetailPage({
  params,
}: {
  params: Promise<{ serviceId: string; projectId: string; versionId: string }>;
}) {
  const { projectId, versionId } = await params;
  const [version, versions] = await Promise.all([
    imageEditorServerService.getProjectVersion(projectId, versionId),
    imageEditorServerService.listProjectVersions(projectId),
  ]);

  // Mirrors the backend's edit-lock rule (ProjectVersionService.AssertEditable):
  // only the most recently created, non-active version may be edited.
  const isLatest = versions[0]?.id === versionId;
  const isEditable = isLatest && !version.isActive;

  return (
    <DefaultPage>
      <Section name="Version">
        <p>
          <Link href={await getServiceLocalUrl(`/project/${projectId}/version`)}>
            &larr; Zurück zu Versionen
          </Link>
        </p>
        <h2>
          {version.id}
          {' '}
          {version.isActive && <Badge color={colors.lightGreen}>aktiv</Badge>}
          {!version.isActive && isLatest && <Badge color={colors.lightBlue}>Entwurf</Badge>}
          {!version.isActive && !isLatest && <Badge color={colors.contrastNormal}>historisch</Badge>}
        </h2>
        <p>{version.width}&times;{version.height}px</p>
        {version.externalId && <p>External Id: <code>{version.externalId}</code></p>}
        <p>Erstellt: {version.creationTime}</p>
        <p>
          <Link href={await getServiceLocalUrl(`/project/${projectId}/version/${versionId}/parameter`)}>
            Parameter verwalten &rarr;
          </Link>
          {' | '}
          <Link href={await getServiceLocalUrl(`/project/${projectId}/version/${versionId}/layers`)}>
            Ebenen bearbeiten &rarr;
          </Link>
        </p>
        {!version.isActive && (
          <ActivateVersionButton projectId={projectId} versionId={versionId} />
        )}
      </Section>

      {isEditable ? (
        <Section name="Version bearbeiten">
          <UpdateVersionForm args={{ version }} />
        </Section>
      ) : (
        <Section name="Version bearbeiten">
          <p>
            {version.isActive
              ? 'Diese Version ist aktiv und daher nicht bearbeitbar. Lege eine neue Version an, um weiter zu bearbeiten.'
              : 'Nur die zuletzt erstellte, nicht aktive Version eines Projekts kann bearbeitet werden. Diese Version ist historisch (read-only).'}
          </p>
        </Section>
      )}

      <RenderPreview projectId={projectId} versionId={versionId} />
    </DefaultPage>
  );
}
