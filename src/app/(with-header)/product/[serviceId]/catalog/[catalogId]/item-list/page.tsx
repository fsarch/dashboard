import { DefaultPage } from "@/components/universals/page/DefaultPage.component";
import QueryableItemList from "@/components/apps/product/item/queryable-list/QueryableItemList";

function convertToArray(param: string | Array<string> | undefined): Array<string> | undefined {
  if (param === undefined) {
    return undefined;
  }

  return Array.isArray(param) ? param : [param];
}

function convertAttributes(searchParams: Record<string, string>) {
  const enabledAttributes = convertToArray(searchParams['attribute.enable']);

  const attributes: Record<string, string> = {};
  if (enabledAttributes) {
    enabledAttributes.forEach((attributeId) => {
      const filterValue = searchParams[`attribute.filter.${attributeId}`];
      if (filterValue) {
        attributes[attributeId] = filterValue;
      }
    });
  }

  return attributes;
}

export default async function Home(props: { params: Promise<{ catalogId: string; }>, searchParams: Promise<{ itemTypeId: string; 'attribute.enable': string; [key: string]: string }> }) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const attributes = convertAttributes(searchParams);

  return (
    <DefaultPage>
      <QueryableItemList
        catalogId={params.catalogId}
        itemTypeId={convertToArray(searchParams.itemTypeId)}
        attributes={attributes}
      />
    </DefaultPage>
  );
}
