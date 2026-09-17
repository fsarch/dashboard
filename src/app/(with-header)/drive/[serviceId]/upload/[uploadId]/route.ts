import { NextResponse } from 'next/server';
import { fileServerApiService } from '@/services/file-server/file-server-api.service';

// Raw-bytes proxy for the filesystem storage backend (no presigned URL): the
// browser PUTs the file here (same-origin, no auth header needed client-side)
// and this forwards the still-unbuffered stream to file-server's
// /v1/uploads/:id/content through fetchService, which adds the bearer token.
// Skipped entirely when TUpload.uploadUrl is present (S3 backend) - the
// browser PUTs straight to that presigned URL instead.
export const PUT = async (
  request: Request,
  { params }: { params: Promise<{ uploadId: string }> },
) => {
  const { uploadId } = await params;
  const contentType = request.headers.get('content-type');

  const upload = await fileServerApiService.uploadContent(uploadId, request.body!, contentType);

  return NextResponse.json(upload);
};
