import { imagesService } from "@/services/image/images.service";
import { NextResponse } from "next/server";
import { imagesAdminService } from "@/services/image/images-admin.service";

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ imageId: string }> },
) => {
  const imageId = (await params).imageId;

  console.log(imageId)

  const image = await imagesAdminService.getRawById(imageId);

  return new NextResponse(image, {

  })
};
