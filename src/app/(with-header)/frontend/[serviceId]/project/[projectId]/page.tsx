import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import List from '@/components/universals/list/List';
import ListItem from '@/components/universals/list/ListItem';
import { fetchService } from '@/utils/fetchService';
import CreateProjectVersionForm from '../_components/CreateProjectVersionForm';

type ProjectDto = { id: string; name: string; creationTime: string };
type ProjectVersionDto = { id: string; name?: string; creationTime: string };

const getProject = async (projectId: string): Promise<ProjectDto> => {
  const response = await fetchService(`/v1/projects/${projectId}`);
  return response.json();
};

const listProjectVersions = async (projectId: string): Promise<ProjectVersionDto[]> => {
  const response = await fetchService(`/v1/projects/${projectId}/versions`);
  return response.json();
};

export default async function ProjectDetailPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const [project, versions] = await Promise.all([
    getProject(projectId),
    listProjectVersions(projectId),
  ]);

  return (
    <DefaultPage>
      <Section name="Projekt">
        <h2>{project.name}</h2>
        <p>Erstellt: {project.creationTime}</p>
      </Section>

      <Section name="Versionen">
        <List>
          {versions.map((version) => (
            <ListItem key={version.id}>
              {version.name || version.id} - {version.creationTime}
            </ListItem>
          ))}
        </List>
      </Section>

      <CreateProjectVersionForm projectId={projectId} />
    </DefaultPage>
  );
}
