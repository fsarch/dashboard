import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import List from '@/components/universals/list/List';
import ListItem from '@/components/universals/list/ListItem';
import Link from 'next/link';
import { getServiceLocalUrl } from '@/utils/getServiceLocalUrl';
import { imageEditorServerService } from '@/services/image-editor-server/image-editor-server.service';
import CreateParameterForm from './_components/CreateParameterForm.component';

const TYPE_LABELS: Record<string, string> = {
  text: 'Text',
  number: 'Zahl',
  image: 'Bild',
  object: 'Objekt',
};

export default async function ParameterListPage({
  params,
}: {
  params: Promise<{ serviceId: string; projectId: string; versionId: string }>;
}) {
  const { projectId, versionId } = await params;
  const parameters = await imageEditorServerService.listParameters(projectId, versionId);
  const parametersById = new Map(parameters.map((parameter) => [parameter.id, parameter]));

  return (
    <DefaultPage>
      <Section name="Parameter">
        <List>
          {parameters.map(async (parameter) => (
            <Link
              key={parameter.id}
              href={await getServiceLocalUrl(`/project/${projectId}/version/${versionId}/parameter/${parameter.id}`)}
            >
              <ListItem>
                <span>
                  {parameter.parentId ? `${parametersById.get(parameter.parentId)?.name ?? '?'}.` : ''}
                  {parameter.name}
                </span>
                {' '}
                ({TYPE_LABELS[parameter.type] ?? parameter.type}{parameter.required ? ', Pflichtfeld' : ''})
              </ListItem>
            </Link>
          ))}
        </List>
      </Section>

      <Section name="Parameter erstellen">
        <CreateParameterForm args={{ projectId, versionId }} />
      </Section>
    </DefaultPage>
  );
}
