import ItemList from "@/components/apps/product/item/ItemList";

export default async function Home({ params }: { params: { catalogId: string; itemId: string; } }) {
  return (
    <main>
      <ItemList
        catalogId={params.catalogId}
        parentItemId={params.itemId}
      />
    </main>
  );
}
