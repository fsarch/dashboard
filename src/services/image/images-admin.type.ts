export type ImageDto = {
  id: string;
  width: number;
  height: number;
  fileSize: number;
  mimeType: string;
  md5: string;
  hasAlpha: boolean;
  hasAnimation: boolean;
  creationTime: string;
  slugs?: Array<{
    slug: string;
  }>;
}
