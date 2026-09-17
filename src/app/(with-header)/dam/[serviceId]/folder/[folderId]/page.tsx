import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
import { damService } from '@/services/dam/dam.service';
import AssetGallery from '@/components/apps/dam/AssetGallery.component';

export const generateMetadata = createAutomaticMetadata();

export default async function DamFolderPage(props: {
  params: Promise<{ serviceId: string; folderId: string }>;
}) {
  const { serviceId, folderId } = await props.params;
  const { path, folders, assets } = await damService.getGalleryView(folderId);

  return (
    <DefaultPage>
      <AssetGallery serviceId={serviceId} path={path} folders={folders.data} assets={assets.data} />
    </DefaultPage>
  );
}
