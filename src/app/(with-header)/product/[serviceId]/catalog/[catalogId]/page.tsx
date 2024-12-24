import List from "@/components/universals/list/List";
import ListItem from "@/components/universals/list/ListItem";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import Link from "next/link";
import { attributeService } from "@/services/product/attribute.service";
import AttributeCreateForm from "@/components/apps/product/attribute/AttributeCreateForm";

export default async function Home({ params }: { params: { catalogId: string } }) {
  const attributes = await attributeService.listAttributes(params.catalogId);

  return (
    <main>
      Attributes
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
      <AttributeCreateForm
        catalogId={params.catalogId}
      />
    </main>
  );
}
