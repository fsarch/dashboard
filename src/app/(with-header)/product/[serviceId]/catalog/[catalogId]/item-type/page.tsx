import List from "@/components/universals/list/List";
import ListItem from "@/components/universals/list/ListItem";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import Link from "next/link";
import Section from "@/components/universals/section/Section";
import { itemTypeService } from "@/services/product/item-type.service";
import ItemTypeCreateForm from "@/components/apps/product/item-type/ItemTypeCreateForm";

export default async function Home(props: { params: Promise<{ catalogId: string }> }) {
  const params = await props.params;
  const itemTypes = await itemTypeService.listItemTypes(params.catalogId);

  return (
    <main>
      <Section name="Elementtyp">
        <List>
          {itemTypes.map(async (itemType) => (
            <Link
              key={itemType.id}
              href={await getServiceLocalUrl(`/catalog/${params.catalogId}/item-type/${itemType.id}`)}
            >
              <ListItem>
                {itemType.name}
              </ListItem>
            </Link>
          ))}
        </List>
      </Section>

      <Section name="Elementtyp erstellen">
        <ItemTypeCreateForm
          catalogId={params.catalogId}
        />
      </Section>
    </main>
  );
}
