import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
import Section from '@/components/universals/section/Section';
import GeneratedForm from '@/components/universals/forms/generated/GeneratedForm.component';
import { driveService } from '@/services/drive/drive.service';
import { FOLDER_MOVE_FORM, FOLDER_RENAME_FORM } from '@/services/drive/drive.forms';
import FolderListing from '@/components/apps/drive/FolderListing.component';
import PermissionsSection from '@/components/apps/file-server-shared/PermissionsSection.component';
import Button from '@/components/universals/forms/Button';
import { colors } from '@/app/_styles/colors';
import { fileServerApiService } from '@/services/file-server/file-server-api.service';
import { redirect } from 'next/navigation';

export const generateMetadata = createAutomaticMetadata();

export default async function DriveFolderPage(props: {
  params: Promise<{ serviceId: string; folderId: string }>;
}) {
  const { serviceId, folderId } = await props.params;
  const folder = await fileServerApiService.getFolder(folderId);
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

      <Section name="Umbenennen">
        <GeneratedForm definition={FOLDER_RENAME_FORM(folderId, folder.name)} />
      </Section>

      <Section name="Verschieben">
        <GeneratedForm definition={FOLDER_MOVE_FORM(folderId)} />
      </Section>

      <Section name="Löschen">
        <form
          action={async () => {
            'use server';
            await fileServerApiService.deleteFolder(folderId);
            redirect(`/drive/${serviceId}${folder.parentId ? `/folder/${folder.parentId}` : ''}`);
          }}
        >
          <Button type="submit" color={colors.error}>
            Ordner in den Papierkorb verschieben
          </Button>
        </form>
      </Section>

      <PermissionsSection
        resourceType="folder"
        resourceId={folderId}
        backPath={`/folder/${folderId}`}
      />
    </DefaultPage>
  );
}
