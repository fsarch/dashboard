import { notFound } from "next/navigation";
import Section from "@/components/universals/section/Section";
import { itemService } from "@/services/product/item.service";
import Link from "next/link";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import ListItem from "@/components/universals/list/ListItem";
import List from "@/components/universals/list/List";
import ItemCreateForm from "@/components/apps/product/item/create/ItemCreateForm";
import { itemTypeService } from "@/services/product/item-type.service";

export default async function Home({ params }: { params: { catalogId: string; itemId: string; } }) {
  const items = await itemService.listItems(params.catalogId, params.itemId);
  if (!items) {
    return notFound();
  }

  const itemTypes = await itemTypeService.listItemTypes(params.catalogId);

  return (
    <main>
      <Section name="Einträge">
        <List>
          {items.map((item) => (
            <Link
              key={item.id}
              href={getServiceLocalUrl(`/catalog/${params.catalogId}/items/${item.id}`)}
            >
              <ListItem>
                {item.name}
              </ListItem>
            </Link>
          ))}
        </List>
      </Section>
      <Section name="Eintrag erstellen">
        <ItemCreateForm
          catalogId={params.catalogId}
          parentItemId={params.itemId}
          itemTypes={itemTypes}
        />
      </Section>
    </main>
  );
}
