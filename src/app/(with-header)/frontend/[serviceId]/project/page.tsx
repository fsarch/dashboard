import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import List from '@/components/universals/list/List';
import ListItem from '@/components/universals/list/ListItem';
import Link from 'next/link';
import { getServiceLocalUrl } from '@/utils/getServiceLocalUrl';
import { fetchService } from '@/utils/fetchService';
import GeneratedForm from '@/components/universals/forms/generated/GeneratedForm.component';
import { CREATE_PROJECT_FORM } from './_forms/create-project.form';

type ProjectDto = { id: string; name: string; creationTime: string };

const listProjects = async (): Promise<ProjectDto[]> => {
  const response = await fetchService('/v1/projects');
  return response.json();
};

export default async function ProjectListPage() {
  const projects = await listProjects();

  return (
    <DefaultPage>
      <Section name="Projekte">
        <List>
          {projects.map(async (project) => (
            <Link key={project.id} href={await getServiceLocalUrl(`/project/${project.id}`)}>
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
