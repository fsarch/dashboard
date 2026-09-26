import AssetGallery from '@/components/apps/dam/AssetGallery.component';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import { damService } from '@/services/dam/dam.service';
import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';

export const generateMetadata = createAutomaticMetadata();

export default async function DamFolderPage(props: {
  params: Promise<{ serviceId: string; folderId: string }>;
}) {
  const { serviceId, folderId } = await props.params;
  const { path, folders, assets } = await damService.getGalleryView(folderId);

  return (
    <DefaultPage>
      <AssetGallery
        serviceId={serviceId}
        path={path}
        folders={folders.data}
        assets={assets.data}
      />
    </DefaultPage>
  );
}
