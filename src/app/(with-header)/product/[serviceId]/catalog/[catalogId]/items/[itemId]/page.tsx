import ItemList from "@/components/apps/product/item/ItemList";
import ItemAttributeList from "@/components/apps/product/item/attribute/ItemAttributeList";

export default async function Home({ params }: { params: { catalogId: string; itemId: string; } }) {
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
