import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
import Section from '@/components/universals/section/Section';
import GeneratedForm from '@/components/universals/forms/generated/GeneratedForm.component';
import Link from 'next/link';
import { fileServerApiService } from '@/services/file-server/file-server-api.service';
import { ASSET_RENAME_FORM } from '@/services/drive/drive.forms';
import AssetThumbnail from '@/components/apps/file-server-shared/AssetThumbnail.component';
import AssetUploadForm from '@/components/apps/drive/upload/AssetUploadForm.component';
import PermissionsSection from '@/components/apps/file-server-shared/PermissionsSection.component';
import Button from '@/components/universals/forms/Button';
import { colors } from '@/app/_styles/colors';
import { redirect } from 'next/navigation';

export const generateMetadata = createAutomaticMetadata();

function formatFileSize(size: number): string {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
}

export default async function DriveAssetPage(props: {
  params: Promise<{ serviceId: string; assetId: string }>;
}) {
  const { serviceId, assetId } = await props.params;
  const [asset, versions] = await Promise.all([
    fileServerApiService.getAsset(assetId),
    fileServerApiService.listAssetVersions(assetId),
  ]);
  const backPath = asset.parentId ? `/folder/${asset.parentId}` : '';

  return (
    <DefaultPage>
      <Link href={`/drive/${serviceId}${backPath}`}>← Zurück</Link>

      <Section name="Datei-Informationen">
        <AssetThumbnail basePath="/drive" serviceId={serviceId} asset={asset} size={200} />
        <dl>
          <dt>Name</dt>
          <dd>{asset.name}</dd>
          <dt>Typ</dt>
          <dd>{asset.type}</dd>
          <dt>MimeType</dt>
          <dd>{asset.mimeType ?? '–'}</dd>
          <dt>Größe</dt>
          <dd>{asset.size ? formatFileSize(asset.size) : '–'}</dd>
        </dl>
        {asset.currentVersionId ? (
          <p>
            <a href={`/drive/${serviceId}/asset/${assetId}/download`}>Herunterladen</a>
          </p>
        ) : (
          <p>Noch kein Inhalt hochgeladen.</p>
        )}
      </Section>

      <Section name="Neue Version hochladen">
        <AssetUploadForm serviceId={serviceId} existingAssetId={assetId} />
      </Section>

      <Section name="Versionen">
        {versions.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Version</th>
                <th>Größe</th>
                <th>Erstellt</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {versions.map((version) => (
                <tr key={version.id}>
                  <td>{version.versionNumber}</td>
                  <td>{formatFileSize(version.size)}</td>
                  <td>{new Date(version.creationTime).toLocaleString('de-DE')}</td>
                  <td>
                    {asset.currentVersionId !== version.id ? (
                      <form
                        action={async () => {
                          'use server';
                          await fileServerApiService.restoreAssetVersion(assetId, version.id);
                        }}
                      >
                        <Button type="submit">Wiederherstellen</Button>
                      </form>
                    ) : (
                      'Aktuell'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Keine Versionen vorhanden.</p>
        )}
      </Section>

      <Section name="Umbenennen">
        <GeneratedForm definition={ASSET_RENAME_FORM(assetId, asset.name, `/asset/${assetId}`)} />
      </Section>

      <Section name="Löschen">
        <form
          action={async () => {
            'use server';
            await fileServerApiService.deleteAsset(assetId);
            redirect(`/drive/${serviceId}${backPath}`);
          }}
        >
          <Button type="submit" color={colors.error}>
            In den Papierkorb verschieben
          </Button>
        </form>
      </Section>

      <PermissionsSection resourceType="asset" resourceId={assetId} backPath={`/asset/${assetId}`} />
    </DefaultPage>
  );
}
