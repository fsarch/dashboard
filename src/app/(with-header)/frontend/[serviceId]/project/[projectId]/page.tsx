import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import { fetchService } from '@/utils/fetchService';
import UpdateProjectForm from './_components/UpdateProjectForm.component';

type ProjectDto = {
  id: string;
  name: string;
  description?: string;
  currentVersionId?: string;
  creationTime: string;
};

const getProject = async (projectId: string): Promise<ProjectDto> => {
  const response = await fetchService(`/v1/projects/${projectId}`);
  return response.json();
};

export default async function ProjectDetailPage({ params }: { params: Promise<{ serviceId: string; projectId: string }> }) {
  const { projectId } = await params;
  const project = await getProject(projectId);

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
    </DefaultPage>
  );
}
