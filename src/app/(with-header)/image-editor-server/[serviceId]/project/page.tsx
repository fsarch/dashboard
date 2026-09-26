import Link from 'next/link';
import GeneratedForm from '@/components/universals/forms/generated/GeneratedForm.component';
import List from '@/components/universals/list/List';
import ListItem from '@/components/universals/list/ListItem';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import type { ProjectDto } from '@/services/image-editor-server/image-editor-server.type';
import { fetchService } from '@/utils/fetchService';
import { getServiceLocalUrl } from '@/utils/getServiceLocalUrl';
import { CREATE_PROJECT_FORM } from './_forms/create-project.form';

const listProjects = async (): Promise<ProjectDto[]> => {
  const response = await fetchService('/v1/projects?take=1000');
  const result = await response.json();
  return result.data;
};

export default async function ProjectListPage() {
  const projects = await listProjects();

  return (
    <DefaultPage>
      <Section name="Projekte">
        <List>
          {projects.map(async (project) => (
            <Link
              key={project.id}
              href={await getServiceLocalUrl(`/project/${project.id}`)}
            >
              <ListItem>{project.name}</ListItem>
            </Link>
          ))}
        </List>
      </Section>
      <Section name="Projekt erstellen">
        <GeneratedForm definition={CREATE_PROJECT_FORM} />
      </Section>
    </DefaultPage>
  );
}
