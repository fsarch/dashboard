import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import { functionService } from '@/services/function/function.service';
import VersionsList from './VersionsList.component';

export default async function FunctionVersionsPage({ params }: { params: Promise<{ serviceId: string; functionId: string }> }) {
  const { serviceId, functionId } = await params;
  const versions = await functionService.getFunctionVersions(functionId);
  const sortedVersions = versions.toSorted((a, b) => new Date(b.creationTime).getTime() - new Date(a.creationTime).getTime());

  return (
    <DefaultPage>
      <Section name="Versionen">
        <VersionsList serviceId={serviceId} functionId={functionId} versions={sortedVersions} />
      </Section>
    </DefaultPage>
  );
}
