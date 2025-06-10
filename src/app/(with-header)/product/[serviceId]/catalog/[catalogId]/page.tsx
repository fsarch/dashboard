import List from "@/components/universals/list/List";
import ListItem from "@/components/universals/list/ListItem";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import Link from "next/link";
import { attributeService } from "@/services/product/attribute.service";
import AttributeCreateForm from "@/components/apps/product/attribute/AttributeCreateForm";
import Section from "@/components/universals/section/Section";
import { itemTypeService } from "@/services/product/item-type.service";
import ItemTypeCreateForm from "@/components/apps/product/item-type/ItemTypeCreateForm";
import ItemList from "@/components/apps/product/item/ItemList";
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";

export default async function Home(props: { params: Promise<{ catalogId: string }> }) {
  const params = await props.params;
  const attributes = await attributeService.listAttributes(params.catalogId);
  const itemTypes = await itemTypeService.listItemTypes(params.catalogId);

  return (
    <DefaultPage>
      <ItemList
        catalogId={params.catalogId}
      />

      <Section name="Attribute">
        <List>
          {attributes.map(async (attribute) => (
            <Link
              key={attribute.id}
              href={await getServiceLocalUrl(`/catalog/${params.catalogId}/attribute/${attribute.id}`)}
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
    </DefaultPage>
  );
}
