import { NextResponse } from "next/server";
import { imagesAdminService } from "@/services/image/images-admin.service";

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ imageId: string }> },
) => {
  const imageId = (await params).imageId;

  const image = await imagesAdminService.getRawById(imageId, {
    size: 250,
  });

  return new NextResponse(image, {
    headers: {
      'Cache-Control': 'private, no-cache, no-store, must-revalidate',
    },
  })
};
