import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
import Section from '@/components/universals/section/Section';
import GeneratedForm from '@/components/universals/forms/generated/GeneratedForm.component';
import Link from 'next/link';
import Button from '@/components/universals/forms/Button';
import { colors } from '@/app/_styles/colors';
import { redirect } from 'next/navigation';
import { fileServerApiService } from '@/services/file-server/file-server-api.service';
import { COLLECTION_ADD_ASSET_FORM, COLLECTION_RENAME_FORM } from '@/services/dam/dam.forms';
import AssetGallery from '@/components/apps/dam/AssetGallery.component';
import PermissionsSection from '@/components/apps/file-server-shared/PermissionsSection.component';

export const generateMetadata = createAutomaticMetadata();

export default async function DamCollectionPage(props: {
  params: Promise<{ serviceId: string; collectionId: string }>;
}) {
  const { serviceId, collectionId } = await props.params;
  const [collection, assets] = await Promise.all([
    fileServerApiService.getCollection(collectionId),
    fileServerApiService.listCollectionAssets(collectionId),
  ]);

  return (
    <DefaultPage>
      <Link href={`/dam/${serviceId}/collections`}>← Zurück zu Sammlungen</Link>

      <Section name={collection.name}>
        {assets.data.length > 0 ? (
          <AssetGallery serviceId={serviceId} path={[]} folders={[]} assets={assets.data} />
        ) : (
          <p>Diese Sammlung enthält noch keine Assets.</p>
        )}
      </Section>

      <Section name="Assets in dieser Sammlung entfernen">
        {assets.data.length > 0 ? (
          <ul>
            {assets.data.map((asset) => (
              <li key={asset.id}>
                {asset.name}{' '}
                <form
                  action={async () => {
                    'use server';
                    await fileServerApiService.removeAssetFromCollection(collectionId, asset.id);
                  }}
                  style={{ display: 'inline' }}
                >
                  <Button type="submit" color={colors.error}>
                    Entfernen
                  </Button>
                </form>
              </li>
            ))}
          </ul>
        ) : null}
      </Section>

      <Section name="Asset hinzufügen">
        <GeneratedForm definition={COLLECTION_ADD_ASSET_FORM(collectionId)} />
      </Section>

      <Section name="Umbenennen">
        <GeneratedForm definition={COLLECTION_RENAME_FORM(collectionId, collection.name)} />
      </Section>

      <Section name="Löschen">
        <form
          action={async () => {
            'use server';
            await fileServerApiService.deleteCollection(collectionId);
            redirect(`/dam/${serviceId}/collections`);
          }}
        >
          <Button type="submit" color={colors.error}>
            In den Papierkorb verschieben
          </Button>
        </form>
      </Section>

      <PermissionsSection
        resourceType="collection"
        resourceId={collectionId}
        backPath={`/collection/${collectionId}`}
      />
    </DefaultPage>
  );
}
