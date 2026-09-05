import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import Link from 'next/link';
import { getServiceLocalUrl } from '@/utils/getServiceLocalUrl';
import { fetchService } from '@/utils/fetchService';
import UpdateVersionForm from './_components/UpdateVersionForm.component';

type ProjectVersionDto = {
  id: string;
  projectId: string;
  name?: string;
  description?: string;
  externalId?: string;
  creationTime: string;
};

const getVersion = async (projectId: string, versionId: string): Promise<ProjectVersionDto> => {
  const response = await fetchService(`/v1/projects/${projectId}/versions/${versionId}`);
  return response.json();
};

export default async function VersionDetailPage({
  params,
}: {
  params: Promise<{ serviceId: string; projectId: string; versionId: string }>;
}) {
  const { projectId, versionId } = await params;
  const version = await getVersion(projectId, versionId);

  return (
    <DefaultPage>
      <Section name="Version">
        <p>
          <Link href={await getServiceLocalUrl(`/project/${projectId}`)}>
            &larr; Zurück zum Projekt
          </Link>
        </p>
        <h2>{version.name || version.id}</h2>
        {version.description && <p>{version.description}</p>}
        {version.externalId && <p>External Id: <code>{version.externalId}</code></p>}
        <p>Erstellt: {version.creationTime}</p>
      </Section>

      <Section name="Version bearbeiten">
        <UpdateVersionForm args={{ version }} />
      </Section>
    </DefaultPage>
  );
}
