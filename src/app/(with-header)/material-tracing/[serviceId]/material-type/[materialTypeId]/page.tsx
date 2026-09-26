import Actions from '@/app/(with-header)/material-tracing/[serviceId]/_components/actions/Actions.component';
import MaterialTypeRemove from '@/app/(with-header)/material-tracing/[serviceId]/material-type/[materialTypeId]/_components/remove/MaterialTypeRemove.component';
import MaterialTypeUpdateForm from '@/components/apps/material-tracing/material-type/MaterialTypeUpdateForm.component';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import { materialTypeService } from '@/services/material-tracing/material-type.service';
import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
import { getServiceLocalUrl } from '@/utils/getServiceLocalUrl';

export const generateMetadata = createAutomaticMetadata();

export default async function Home({
  params,
}: {
  params: Promise<{ materialTypeId: string }>;
}) {
  const materialType = await materialTypeService.getMaterialType(
    (await params).materialTypeId,
  );

  return (
    <DefaultPage>
      <Section name="Informationen">
        <MaterialTypeUpdateForm
          args={{
            materialType,
          }}
        />
      </Section>
      <Actions
        type="material_type"
        basePath={`/v1/material-types/${materialType.id}`}
      />
      <MaterialTypeRemove
        materialTypeId={materialType.id}
        homeUrl={await getServiceLocalUrl('/material-type')}
      />
    </DefaultPage>
  );
}
