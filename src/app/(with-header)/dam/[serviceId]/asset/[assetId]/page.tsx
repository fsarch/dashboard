import Link from 'next/link';
import React from 'react';
import { colors } from '@/app/_styles/colors';
import AssetThumbnail from '@/components/apps/file-server-shared/AssetThumbnail.component';
import PermissionsSection from '@/components/apps/file-server-shared/PermissionsSection.component';
import Badge from '@/components/universals/badge/badge.component';
import Button from '@/components/universals/forms/Button';
import GeneratedForm from '@/components/universals/forms/generated/GeneratedForm.component';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import {
  ASSET_ADD_TAG_FORM,
  ASSET_SET_METADATA_FORM,
} from '@/services/dam/dam.forms';
import { fileServerApiService } from '@/services/file-server/file-server-api.service';
import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';

export const generateMetadata = createAutomaticMetadata();

export default async function DamAssetPage(props: {
  params: Promise<{ serviceId: string; assetId: string }>;
}) {
  const { serviceId, assetId } = await props.params;
  const [asset, metadataValues, allDefinitions, tags, collections] =
    await Promise.all([
      fileServerApiService.getAsset(assetId),
      fileServerApiService.listAssetMetadata(assetId),
      fileServerApiService.listMetadataDefinitions(),
      fileServerApiService.listAssetTags(assetId),
      fileServerApiService.listAssetCollections(assetId),
    ]);

  const backPath = `/asset/${assetId}`;
  const definitionsWithoutValue = allDefinitions.filter(
    (definition) =>
      !metadataValues.some((value) => value.definitionId === definition.id) &&
      (!definition.appliesToType || definition.appliesToType === asset.type),
  );

  return (
    <DefaultPage>
      <Link href={`/dam/${serviceId}`}>← Zurück zur Mediathek</Link>

      <Section name="Vorschau">
        <AssetThumbnail
          basePath="/dam"
          serviceId={serviceId}
          asset={asset}
          size={300}
        />
        <p>
          <strong>{asset.name}</strong> ({asset.mimeType ?? asset.type})
        </p>
        {asset.currentVersionId ? (
          <p>
            <a href={`/dam/${serviceId}/asset/${assetId}/download`}>
              Herunterladen
            </a>
          </p>
        ) : null}
      </Section>

      <Section name="Metadaten">
        {metadataValues.length > 0 ? (
          <dl>
            {metadataValues.map((value) => (
              <React.Fragment key={value.definitionId}>
                <dt>{value.key}</dt>
                <dd>
                  {value.value}{' '}
                  <form
                    action={async () => {
                      'use server';
                      await fileServerApiService.removeAssetMetadata(
                        assetId,
                        value.definitionId,
                      );
                    }}
                    style={{ display: 'inline' }}
                  >
                    <Button type="submit" color={colors.error}>
                      Entfernen
                    </Button>
                  </form>
                </dd>
              </React.Fragment>
            ))}
          </dl>
        ) : (
          <p>Keine Metadaten gesetzt.</p>
        )}

        {definitionsWithoutValue.map((definition) => (
          <details key={definition.id}>
            <summary>{definition.key} setzen</summary>
            <GeneratedForm
              definition={ASSET_SET_METADATA_FORM(
                assetId,
                definition.id,
                definition.dataType,
                backPath,
              )}
            />
          </details>
        ))}
      </Section>

      <Section name="Tags">
        {tags.length > 0 ? (
          <div>
            {tags.map((tag) => (
              <Badge key={tag.id} color={colors.lightPurple}>
                {tag.key}{' '}
                <form
                  action={async () => {
                    'use server';
                    await fileServerApiService.removeAssetTag(assetId, tag.id);
                  }}
                  style={{ display: 'inline' }}
                >
                  <button type="submit">×</button>
                </form>
              </Badge>
            ))}
          </div>
        ) : (
          <p>Keine Tags vorhanden.</p>
        )}
        <GeneratedForm definition={ASSET_ADD_TAG_FORM(assetId, backPath)} />
      </Section>

      <Section name="Sammlungen">
        {collections.length > 0 ? (
          <ul>
            {collections.map((collection) => (
              <li key={collection.id}>
                <Link href={`/dam/${serviceId}/collection/${collection.id}`}>
                  {collection.name}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>
            In keiner Sammlung enthalten. Über die{' '}
            <Link href={`/dam/${serviceId}/collections`}>
              Sammlungen-Übersicht
            </Link>{' '}
            hinzufügen.
          </p>
        )}
      </Section>

      <PermissionsSection
        resourceType="asset"
        resourceId={assetId}
        backPath={backPath}
      />
    </DefaultPage>
  );
}
