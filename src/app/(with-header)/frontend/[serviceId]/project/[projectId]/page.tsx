import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import List from '@/components/universals/list/List';
import ListItem from '@/components/universals/list/ListItem';
import { fetchService } from '@/utils/fetchService';
import CreateProjectVersionForm from '../_components/CreateProjectVersionForm';
import UpdateProjectForm from './_components/UpdateProjectForm.component';

type ProjectDto = {
  id: string;
  name: string;
  description?: string;
  currentVersionId?: string;
  creationTime: string;
};
type ProjectVersionDto = { id: string; name?: string; creationTime: string };

const getProject = async (projectId: string): Promise<ProjectDto> => {
  const response = await fetchService(`/v1/projects/${projectId}`);
  return response.json();
};

const listProjectVersions = async (projectId: string): Promise<ProjectVersionDto[]> => {
  const response = await fetchService(`/v1/projects/${projectId}/versions`);
  return response.json();
};

export default async function ProjectDetailPage({ params }: { params: Promise<{ serviceId: string; projectId: string }> }) {
  const { serviceId, projectId } = await params;
  const [project, versions] = await Promise.all([
    getProject(projectId),
    listProjectVersions(projectId),
  ]);

  return (
    <DefaultPage>
      <Section name="Projekt">
        <h2>{project.name}</h2>
        {project.description && <p>{project.description}</p>}
        <p>Erstellt: {project.creationTime}</p>
      </Section>

      <Section name="Projekt bearbeiten">
        <UpdateProjectForm args={{ project }} />
      </Section>

      <Section name="Versionen">
        <List>
          {versions.map((version) => (
            <ListItem key={version.id}>
              {version.name || version.id} - {version.creationTime}
              {version.id === project.currentVersionId && ' (aktiv)'}
            </ListItem>
          ))}
        </List>
      </Section>

      <CreateProjectVersionForm serviceId={serviceId} projectId={projectId} />
    </DefaultPage>
  );
}
