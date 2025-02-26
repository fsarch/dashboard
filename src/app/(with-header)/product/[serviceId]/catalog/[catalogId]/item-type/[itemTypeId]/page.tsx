import { itemTypeService } from "@/services/product/item-type.service";
import { notFound } from "next/navigation";
import { attributeService } from "@/services/product/attribute.service";
import Section from "@/components/universals/section/Section";
import ItemTypeAttributeSelection from "@/components/apps/product/item-type/ItemTypeAttributeSelection";

export default async function Home(props: { params: Promise<{ catalogId: string; itemTypeId: string; }> }) {
  const params = await props.params;
  const itemType = await itemTypeService.getItemType(params.catalogId, params.itemTypeId);
  if (!itemType) {
    return notFound();
  }

  const attributes = await attributeService.listAttributes(params.catalogId);
  const attributeItemTypes = await itemTypeService.listAttributes(params.catalogId, params.itemTypeId);
  const selectedAttributeIds = attributeItemTypes.map((attributeItemType) => attributeItemType.attributeId);

  return (
    <main>
      <h1>{itemType.name}</h1>
      <Section name="Attribute">
        <ItemTypeAttributeSelection
          catalogId={params.catalogId}
          itemTypeId={params.itemTypeId}
          attributes={attributes}
          selectedAttributeIds={selectedAttributeIds}
        />
      </Section>
    </main>
  );
}
