import ItemList from "@/components/apps/product/item/ItemList";
import ItemAttributeList from "@/components/apps/product/item/attribute/ItemAttributeList";

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
    </main>
  );
}
