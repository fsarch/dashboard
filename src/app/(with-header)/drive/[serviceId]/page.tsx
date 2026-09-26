import FolderListing from '@/components/apps/drive/FolderListing.component';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import { driveService } from '@/services/drive/drive.service';
import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';

export const generateMetadata = createAutomaticMetadata();

export default async function DriveRootPage(props: {
  params: Promise<{ serviceId: string }>;
}) {
  const { serviceId } = await props.params;
  const { path, folders, assets } = await driveService.getFolderView(null);

  return (
    <DefaultPage>
      <FolderListing
        serviceId={serviceId}
        folderId={null}
        path={path}
        folders={folders.data}
        assets={assets.data}
      />
    </DefaultPage>
  );
}
