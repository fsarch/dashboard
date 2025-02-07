import List from "@/components/universals/list/List";
import ListItem from "@/components/universals/list/ListItem";
import { imagesAdminService } from "@/services/image/images-admin.service";
import TileList from "@/components/universals/tile-list/TileList";
import TileListItem from "@/components/universals/tile-list/TileListItem";
import ImageUploadForm from "@/components/apps/image/upload/ImageUploadForm";

export default async function Home({ params }: { params: { serviceId: string } }) {
  const images = await imagesAdminService.listImages();

  return (
    <div>
      Images
      <TileList>
        {images.map((image) => (
          <TileListItem
            key={image.id}
            backgroundImage={`/image/${params.serviceId}/images/blob/${image.id}`}
            name=""
          />
        ))}
      </TileList>
      <ImageUploadForm
        serviceId={params.serviceId}
      />
    </div>
  );
}
