import { fetchService } from "@/utils/fetchService";
import {
  AttributeDto,
} from "@/services/product/attribute.type";

const listItemTypes = async (catalogId: string): Promise<Array<AttributeDto>> => {
  const itemTypesResponse = await fetchService(`/v1/catalogs/${catalogId}/item-types`);
  const itemType = await itemTypesResponse.json();

  return itemType;
};

export const itemTypeService = {
  listItemTypes,
};
