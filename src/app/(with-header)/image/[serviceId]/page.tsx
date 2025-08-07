import List from "@/components/universals/list/List";
import ListItem from "@/components/universals/list/ListItem";
import { imagesAdminService } from "@/services/image/images-admin.service";
import ImageUploadForm from "@/components/apps/image/upload/ImageUploadForm";
import Image from "next/image";
import styles from "./page.module.scss";
import Badge from "@/components/universals/badge/badge.component";
import { colors } from "@/app/_styles/colors";
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";

function formatFileSize(size: number): string {
  if (size < 1024) {
    return `${size} B`;
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`;
  } else {
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  }
}

export default async function Home(props: { params: Promise<{ serviceId: string }> }) {
  const params = await props.params;
  const images = await imagesAdminService.listImages();

  return (
    <DefaultPage>
      Images
      <List>
        {images.map((image) => (
          <ListItem
            key={image.id}
          >
            <div className={styles.imageListItem}>
              <div>
                <Image
                  src={`/image/${params.serviceId}/images/blob/${image.id}`}
                  className={styles.imageListItemPreview}
                  alt=""
                  width={150}
                  height={150}
                />
              </div>
              <div className={styles.imageListItemDetails}>
                <h2>
                  {image.id}
                  <span className={styles.imageListItemHeadlineBadges}>
                    {image.hasAlpha ? (
                      <Badge
                        color={colors.lightBlue}
                      >
                        Transparenz
                      </Badge>
                    ) : null}
                    {image.hasAnimation ? (
                      <Badge
                        color={colors.lightGreen}
                      >
                        Animation
                      </Badge>
                    ) : null}
                  </span>
                </h2>
                <dl className={styles.imageListItemDetailsList}>
                  <dt>Breite</dt>
                  <dd>{image.width}px</dd>
                  <dt>Höhe</dt>
                  <dd>{image.height}px</dd>
                  <dt>MimeType</dt>
                  <dd>{image.mimeType}</dd>
                  <dt>Dateigröße</dt>
                  <dd
                    title={`${image.fileSize.toString(10)} Bytes`}
                  >
                    {formatFileSize(image.fileSize)}
                  </dd>
                  <dt>MD5</dt>
                  <dd>{image.md5}</dd>
                  <dt>Slugs</dt>
                  <dd>
                    {image.slugs?.length ? (
                      <ul className={styles.imageListItemSlugsList}>
                        {image.slugs.map((slug) => (
                          <li key={slug.slug}>
                            {slug.slug}
                          </li>
                        ))}
                      </ul>
                    ) : '-'}
                  </dd>
                </dl>
              </div>
            </div>
          </ListItem>
        ))}
      </List>
      <ImageUploadForm
        serviceId={params.serviceId}
      />
    </DefaultPage>
  );
}
