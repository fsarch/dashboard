import List from "@/components/universals/list/List";
import ListItem from "@/components/universals/list/ListItem";
import { imagesAdminService } from "@/services/image/images-admin.service";
import { ImageDto } from "@/services/image/images-admin.type";
import ImageUploadForm from "@/components/apps/image/upload/ImageUploadForm";
import ImagePaginationClient from "@/components/apps/image/ImagePaginationClient.component";
import styles from "./page.module.scss";
import Badge from "@/components/universals/badge/badge.component";
import { colors } from "@/app/_styles/colors";
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";
import { createAutomaticMetadata } from "@/utils/createAutomaticMetadata";
import Link from "next/link";

export const generateMetadata = createAutomaticMetadata();

function formatFileSize(size: number): string {
  if (size < 1024) {
    return `${size} B`;
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`;
  } else {
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  }
}

// Visibility Badge Component
function VisibilityBadge(props: { isPublic: boolean }) {
  const { isPublic } = props;
  return (
    <Badge color={isPublic ? colors.lightGreen : colors.lightRed}>
      {isPublic ? 'Öffentlich' : 'Privat'}
    </Badge>
  );
}

export default async function ImageListPage(props: {
  params: Promise<{ serviceId: string }>;
  searchParams: Promise<{
    page?: string;
    limit?: string;
    isPublic?: string;
    tag?: string;
  }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  // Parse search params
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const limit = searchParams.limit ? parseInt(searchParams.limit) : 25;
  const isPublic = searchParams.isPublic ? searchParams.isPublic === 'true' : undefined;
  const tagFilter = searchParams.tag ? searchParams.tag.split(',') : undefined;

  // Fetch images with embed=tags for showing tags in list
  const result = await imagesAdminService.listImages({
    embed: ['tags'],
    page,
    limit,
    isPublic,
    tag: tagFilter,
  });

  const images: ImageDto[] = result.data;
  const metadata = result.metadata;

  return (
    <DefaultPage>
      {/* Filter Controls */}
      <div className={styles.filters}>
        <form method="get" action={`/image/${params.serviceId}`}>
          <select name="isPublic" defaultValue={searchParams.isPublic || ''}>
            <option value="">Alle Bilder</option>
            <option value="true">Nur öffentliche</option>
            <option value="false">Nur private</option>
          </select>
          <button type="submit">Filtern</button>
        </form>
      </div>

      <List>
        {images.map((image) => (
          <ListItem key={image.id}>
            <Link
              href={`/image/${params.serviceId}/images/${image.id}`}
              className={styles.imageListItemLink}
            >
              <div className={styles.imageListItem}>
                <div>
                  <img
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
                      {image.hasAlpha && (
                        <Badge color={colors.lightBlue}>Transparenz</Badge>
                      )}
                      {image.hasAnimation && (
                        <Badge color={colors.lightGreen}>Animation</Badge>
                      )}
                      <VisibilityBadge isPublic={image.isPublic} />
                    </span>
                  </h2>

                  {/* Tags anzeigen */}
                  {image.tags?.length ? (
                    <div className={styles.imageListItemTags}>
                      {image.tags.map((tag) => (
                        <Badge key={tag} color={colors.lightPurple}>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  ) : null}

                  <dl className={styles.imageListItemDetailsList}>
                    <dt>Breite</dt>
                    <dd>{image.width}px</dd>
                    <dt>Höhe</dt>
                    <dd>{image.height}px</dd>
                    <dt>MimeType</dt>
                    <dd>{image.mimeType}</dd>
                    <dt>Dateigröße</dt>
                    <dd title={`${image.fileSize.toString(10)} Bytes`}>
                      {formatFileSize(image.fileSize)}
                    </dd>
                    <dt>MD5</dt>
                    <dd>{image.md5}</dd>
                    {image.slugs?.length ? (
                      <>
                        <dt>Slugs</dt>
                        <dd>
                          <ul className={styles.imageListItemSlugsList}>
                            {image.slugs.map((slug) => (
                              <li key={slug.slug}>{slug.slug}</li>
                            ))}
                          </ul>
                        </dd>
                      </>
                    ) : null}
                  </dl>
                </div>
              </div>
            </Link>
          </ListItem>
        ))}
      </List>

      {/* Pagination */}
      <ImagePaginationClient
        currentPage={metadata.currentPage}
        pageSize={metadata.pageSize}
        totalItems={metadata.totalItems}
        totalPages={metadata.totalPages}
        filter={{ isPublic, tag: tagFilter }}
      />

      <ImageUploadForm serviceId={params.serviceId} />
    </DefaultPage>
  );
}
