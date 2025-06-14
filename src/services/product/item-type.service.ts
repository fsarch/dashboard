import { fetchService } from "@/utils/fetchService";
import {
  AttributeItemTypeCreateDto,
  AttributeItemTypeDto,
  ItemTypeCreateDto,
  ItemTypeDto
} from "@/services/product/item-type.type";

const listItemTypes = async (catalogId: string): Promise<Array<ItemTypeDto>> => {
  const itemTypesResponse = await fetchService(`/v1/catalogs/${catalogId}/item-types`);
  const itemType = await itemTypesResponse.json();

  return itemType;
};

const getItemType = async (catalogId: string, itemTypeId: string): Promise<ItemTypeDto | null> => {
  return (await listItemTypes(catalogId)).find(it => it.id = itemTypeId) ?? null;
};

export type TListAttributeOptions = {
  embed: Array<'attribute'>;
};

const listAttributes = async (catalogId: string, itemTypeId: string, options?: TListAttributeOptions): Promise<Array<AttributeItemTypeDto>> => {
  const searchParams = new URLSearchParams();
  if (options?.embed) {
    options.embed.forEach((embed) => {
      searchParams.append('embed', embed);
    });
  }

  const itemTypesResponse = await fetchService(`/v1/catalogs/${catalogId}/item-types/${itemTypeId}/attributes?${searchParams}`);
  const itemType = await itemTypesResponse.json();

  return itemType;
};

const createAttribute = async (
  catalogId: string,
  itemTypeId: string,
  attributeId: string,
  createDto: AttributeItemTypeCreateDto,
): Promise<{ id: string } | null> => {
  const res = await fetchService(`/v1/catalogs/${catalogId}/item-types/${itemTypeId}/attributes`, {
    method: 'POST',
    body: JSON.stringify({
      ...createDto,
      attributeId,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return await res.json();
};

const createItemType = async (
  catalogId: string,
  createDto: ItemTypeCreateDto,
) => {
  const res = await fetchService(`/v1/catalogs/${catalogId}/item-types`, {
    method: 'POST',
    body: JSON.stringify({
      ...createDto,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return await res.json();
};

export const itemTypeService = {
  listItemTypes,
  getItemType,
  listAttributes,
  createAttribute,
  createItemType,
};
