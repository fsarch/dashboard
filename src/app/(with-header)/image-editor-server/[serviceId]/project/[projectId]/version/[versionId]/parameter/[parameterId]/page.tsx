import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import Link from 'next/link';
import { getServiceLocalUrl } from '@/utils/getServiceLocalUrl';
import { fetchService } from '@/utils/fetchService';
import UpdateParameterForm from './_components/UpdateParameterForm.component';
import { ParameterDto } from '@/services/image-editor-server/image-editor-server.type';

const getParameter = async (projectId: string, versionId: string, parameterId: string): Promise<ParameterDto> => {
  const response = await fetchService(`/v1/projects/${projectId}/versions/${versionId}/parameters/${parameterId}`);
  return response.json();
};

export default async function ParameterDetailPage({
  params,
}: {
  params: Promise<{ serviceId: string; projectId: string; versionId: string; parameterId: string }>;
}) {
  const { projectId, versionId, parameterId } = await params;
  const parameter = await getParameter(projectId, versionId, parameterId);

  return (
    <DefaultPage>
      <Section name="Parameter">
        <p>
          <Link href={await getServiceLocalUrl(`/project/${projectId}/version/${versionId}/parameter`)}>
            &larr; Zurück zu Parametern
          </Link>
        </p>
        <h2>{parameter.name}</h2>
        <p>Typ: {parameter.type}{parameter.required ? ' (Pflichtfeld)' : ''}</p>
      </Section>

      <Section name="Parameter bearbeiten">
        <UpdateParameterForm args={{ projectId, versionId, parameter }} />
      </Section>
    </DefaultPage>
  );
}
