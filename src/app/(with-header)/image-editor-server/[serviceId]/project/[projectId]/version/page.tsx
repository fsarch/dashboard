import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import List from '@/components/universals/list/List';
import ListItem from '@/components/universals/list/ListItem';
import Link from 'next/link';
import { getServiceLocalUrl } from '@/utils/getServiceLocalUrl';
import { colors } from '@/app/_styles/colors';
import Badge from '@/components/universals/badge/badge.component';
import CreateVersionForm from './_components/CreateVersionForm.component';
import { imageEditorServerService } from '@/services/image-editor-server/image-editor-server.service';

export default async function ProjectVersionListPage({ params }: { params: Promise<{ serviceId: string; projectId: string }> }) {
  const { projectId } = await params;
  // Ordered creationTime DESC by the backend, so versions[0] is always "the
  // latest" - the only one that can ever be editable (see AGENTS.md /
  // image-editor-server's edit-lock rule).
  const versions = await imageEditorServerService.listProjectVersions(projectId);
  const latestVersionId = versions[0]?.id;

  return (
    <DefaultPage>
      <Section name="Versionen">
        <List>
          {versions.map(async (version) => (
            <Link key={version.id} href={await getServiceLocalUrl(`/project/${projectId}/version/${version.id}`)}>
              <ListItem>
                <span>{version.id} - {version.width}&times;{version.height} - {version.creationTime}</span>
                {' '}
                {version.isActive && <Badge color={colors.lightGreen}>aktiv</Badge>}
                {!version.isActive && version.id === latestVersionId && <Badge color={colors.lightBlue}>Entwurf</Badge>}
                {version.externalId && <div>{version.externalId}</div>}
              </ListItem>
            </Link>
          ))}
        </List>
      </Section>

      <Section name="Version erstellen">
        <p>Legt einen neuen Entwurf an. Nur die zuletzt erstellte, nicht aktive Version kann bearbeitet werden.</p>
        <CreateVersionForm args={{ projectId }} />
      </Section>
    </DefaultPage>
  );
}
