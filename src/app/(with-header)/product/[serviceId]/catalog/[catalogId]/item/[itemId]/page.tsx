import ItemList from "@/components/apps/product/item/ItemList";
import ItemAttributeList from "@/components/apps/product/item/attribute/ItemAttributeList";
import ItemRemove from "@/components/apps/product/item/remove/ItemRemove";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";

export default async function Home(props: { params: Promise<{ catalogId: string; itemId: string; }> }) {
  const params = await props.params;
  return (
    <main>
      <ItemList
        catalogId={params.catalogId}
        parentItemId={params.itemId}
      />
      <ItemAttributeList
        catalogId={params.catalogId}
        itemId={params.itemId}
      />
      <ItemRemove
        catalogId={params.catalogId}
        itemId={params.itemId}
        homeUrl={await getServiceLocalUrl(`/catalog/${params.catalogId}`)}
      />
    </main>
  );
}
