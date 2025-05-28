import ItemList from "@/components/apps/product/item/ItemList";

export default async function Home(props: { params: Promise<{ catalogId: string }> }) {
  const params = await props.params;

  return (
    <main>
      <ItemList
        catalogId={params.catalogId}
      />
    </main>
  );
}
