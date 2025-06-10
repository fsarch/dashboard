import ItemList from "@/components/apps/product/item/ItemList";
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";

export default async function Home(props: { params: Promise<{ catalogId: string }> }) {
  const params = await props.params;

  return (
    <DefaultPage>
      <ItemList
        catalogId={params.catalogId}
      />
    </DefaultPage>
  );
}
