import { imagesAdminService } from '@/services/image/images-admin.service';
import { ImageDto, TagDefinitionDto } from '@/services/image/images-admin.type';
import { IMAGE_TAG_CREATE_FORM } from '@/services/image/image.forms';
import GeneratedForm from '@/components/universals/forms/generated/GeneratedForm.component';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import Badge from '@/components/universals/badge/badge.component';
import { colors } from '@/app/_styles/colors';
import Link from 'next/link';
import styles from './page.module.scss';
import Button from '@/components/universals/forms/Button';
import PatchImageVisibilityForm from '@/components/apps/image/patch/PatchImageVisibilityForm';

export default async function ImageDetailPage(props: {
  params: Promise<{ serviceId: string; imageId: string }>;
}) {
  const { serviceId, imageId } = await props.params;

  // Bild-Informationen mit Tags laden
  const image = await imagesAdminService.getImageById(imageId);

  // Tag-Definitionen für das Select-Formular laden
  const tagDefinitions = await imagesAdminService.listTagDefinitions();

  // Aktuelle Tags des Bildes laden (falls nicht schon in image.tags enthalten)
  const currentTags = image.tags || [];

  return (
    <DefaultPage>
      <Link href={`/image/${serviceId}`} className={styles.backLink}>
        ← Zurück zur Bilderliste
      </Link>

      <Section name="Bild-Informationen">
        <div className={styles.imageInfo}>
          <div className={styles.imagePreview}>
            <img
              src={`/image/${serviceId}/images/blob/${imageId}`}
              alt=""
              width={300}
              height={300}
              style={{ objectFit: 'contain', background: 'repeating-conic-gradient(#A0A0A0 0 25%, #606060 0 50%) 50% / 20px 20px' }}
            />
          </div>
          <div className={styles.imageDetails}>
            <dl>
              <dt>ID</dt>
              <dd>{image.id}</dd>
              <dt>Größe</dt>
              <dd>
                {image.width}x{image.height}px
              </dd>
              <dt>Dateityp</dt>
              <dd>{image.mimeType}</dd>
              <dt>Dateigröße</dt>
              <dd>{formatFileSize(image.fileSize)}</dd>
              <dt>MD5</dt>
              <dd>{image.md5}</dd>
              <dt>Visibility</dt>
              <dd>
                <Badge color={image.isPublic ? colors.lightGreen : colors.lightRed}>
                  {image.isPublic ? 'Öffentlich' : 'Privat'}
                </Badge>
              </dd>
              {image.hasAlpha && (
                <>
                  <dt>Transparenz</dt>
                  <dd>
                    <Badge color={colors.lightBlue}>Ja</Badge>
                  </dd>
                </>
              )}
              {image.hasAnimation && (
                <>
                  <dt>Animation</dt>
                  <dd>
                    <Badge color={colors.lightGreen}>Ja</Badge>
                  </dd>
                </>
              )}
              {image.slugs?.length ? (
                <>
                  <dt>Slugs</dt>
                  <dd>
                    <ul className={styles.slugsList}>
                      {image.slugs.map((slug) => (
                        <li key={slug.slug}>{slug.slug}</li>
                      ))}
                    </ul>
                  </dd>
                </>
              ) : null}
              {image.externalId && (
                <>
                  <dt>Externe ID</dt>
                  <dd>{image.externalId}</dd>
                </>
              )}
            </dl>
          </div>
        </div>
      </Section>

      <Section name="Tags">
        {currentTags.length > 0 ? (
          <div className={styles.tagsList}>
            {currentTags.map((tag) => (
              <div key={tag} className={styles.tagItem}>
                <Badge color={colors.lightPurple} className={styles.tagBadge}>
                  {tag}
                </Badge>
                <form
                  action={async () => {
                    'use server';
                    await imagesAdminService.deleteImageTag(imageId, tag);
                  }}
                  className={styles.deleteForm}
                >
                  <Button
                    type="submit"
                    color={colors.error}
                  >
                    × Löschen
                  </Button>
                </form>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.noTags}>Keine Tags für dieses Bild vorhanden.</p>
        )}
      </Section>

      <Section name="Neuen Tag hinzufügen">
        <GeneratedForm
          definition={IMAGE_TAG_CREATE_FORM(imageId)}
          args={{ imageId }}
        />
      </Section>

      <Section name="Visibility ändern">
        <PatchImageVisibilityForm
          imageId={imageId}
          currentVisibility={image.isPublic}
          serviceId={serviceId}
        />
      </Section>

      <div className={styles.spacer} />
    </DefaultPage>
  );
}

function formatFileSize(size: number): string {
  if (size < 1024) {
    return `${size} B`;
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`;
  } else {
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  }
}
