import List from "@/components/universals/list/List";
import ListItem from "@/components/universals/list/ListItem";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import Link from "next/link";
import { attributeService } from "@/services/product/attribute.service";
import AttributeCreateForm from "@/components/apps/product/attribute/AttributeCreateForm";
import Section from "@/components/universals/section/Section";
import { itemTypeService } from "@/services/product/item-type.service";
import { itemService } from "@/services/product/item.service";
import ItemTypeCreateForm from "@/components/apps/product/item-type/ItemTypeCreateForm";
import ItemList from "@/components/apps/product/item/ItemList";

export default async function Home({ params }: { params: { catalogId: string } }) {
  const attributes = await attributeService.listAttributes(params.catalogId);
  const items = await itemService.listItems(params.catalogId);
  const itemTypes = await itemTypeService.listItemTypes(params.catalogId);

  return (
    <main>
      <ItemList
        catalogId={params.catalogId}
      />

      <Section name="Attribute">
        <List>
          {attributes.map((attribute) => (
            <Link
              key={attribute.id}
              href={getServiceLocalUrl(`/catalog/${params.catalogId}/attributes/${attribute.id}`)}
            >
              <ListItem>
                {attribute.name}
              </ListItem>
            </Link>
          ))}
        </List>
      </Section>
      <Section name="Attribut erstellen">
        <AttributeCreateForm
          catalogId={params.catalogId}
        />
      </Section>

      <Section name="Elementtyp">
        <List>
          {itemTypes.map((itemType) => (
            <Link
              key={itemType.id}
              href={getServiceLocalUrl(`/catalog/${params.catalogId}/item-type/${itemType.id}`)}
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
