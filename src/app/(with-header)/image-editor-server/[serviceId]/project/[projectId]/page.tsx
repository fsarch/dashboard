import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import Link from 'next/link';
import { getServiceLocalUrl } from '@/utils/getServiceLocalUrl';
import { fetchService } from '@/utils/fetchService';
import UpdateProjectForm from './_components/UpdateProjectForm.component';
import { ProjectDto } from '@/services/image-editor-server/image-editor-server.type';

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
        {project.externalId && <p>External Id: <code>{project.externalId}</code></p>}
        <p>Erstellt: {project.creationTime}</p>
        <p>
          <Link href={await getServiceLocalUrl(`/project/${projectId}/version`)}>
            Versionen verwalten &rarr;
          </Link>
        </p>
      </Section>

      <Section name="Projekt bearbeiten">
        <UpdateProjectForm args={{ project }} />
      </Section>
    </DefaultPage>
  );
}
