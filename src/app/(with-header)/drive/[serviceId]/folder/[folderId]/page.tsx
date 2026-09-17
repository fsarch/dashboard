import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
import Section from '@/components/universals/section/Section';
import GeneratedForm from '@/components/universals/forms/generated/GeneratedForm.component';
import { driveService } from '@/services/drive/drive.service';
import { FOLDER_MOVE_FORM } from '@/services/drive/drive.forms';
import FolderListing from '@/components/apps/drive/FolderListing.component';
import PermissionsSection from '@/components/apps/file-server-shared/PermissionsSection.component';

export const generateMetadata = createAutomaticMetadata();

export default async function DriveFolderPage(props: {
  params: Promise<{ serviceId: string; folderId: string }>;
}) {
  const { serviceId, folderId } = await props.params;
  const { path, folders, assets } = await driveService.getFolderView(folderId);

  return (
    <DefaultPage>
      <FolderListing
        serviceId={serviceId}
        folderId={folderId}
        path={path}
        folders={folders.data}
        assets={assets.data}
      />

      <Section name="Verschieben">
        <GeneratedForm definition={FOLDER_MOVE_FORM(folderId, serviceId)} />
      </Section>

      <PermissionsSection
        resourceType="folder"
        resourceId={folderId}
        backPath={`/folder/${folderId}`}
      />
    </DefaultPage>
  );
}
