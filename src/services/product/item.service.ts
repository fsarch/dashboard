import { fetchService } from "@/utils/fetchService";
import {
  AttributeDto,
} from "@/services/product/attribute.type";
import { ItemCreateDto, ItemDto } from "@/services/product/item.type";

const listItems = async (catalogId: string, parentItemId: string | null | undefined, options?: { itemTypeId?: Array<string>; activeAttributeFilters?: Record<string, string> }): Promise<Array<ItemDto>> => {
  const queryParams = new URLSearchParams();
  if (parentItemId !== undefined) {
    queryParams.append('parentItemId', parentItemId ?? 'null');
  }

  if (options?.itemTypeId) {
    options.itemTypeId.forEach((itemTypeId) => {
      queryParams.append('itemTypeId', itemTypeId);
    })
  }

  if (options?.activeAttributeFilters) {
    Object.entries(options.activeAttributeFilters).forEach(([attributeId, attributeValue]) => {
      queryParams.append('filter', `attribute:${attributeId}=${attributeValue}`);
    })
  }

  const itemResponse = await fetchService(`/v1/catalogs/${catalogId}/items?${queryParams}`);
  const items = await itemResponse.json();

  console.log('found items', items);

  return items;
};

const createItem = async (catalogId: string, createDto: ItemCreateDto): Promise<Array<AttributeDto>> => {
  const itemResponse = await fetchService(`/v1/catalogs/${catalogId}/items`, {
    method: "POST",
    body: JSON.stringify(createDto),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const items = await itemResponse.json();

  return items;
};

const getItem = async (catalogId: string, itemId?: string): Promise<ItemDto> => {
  const itemResponse = await fetchService(`/v1/catalogs/${catalogId}/items/${itemId}`);
  const item = await itemResponse.json();

  return item;
}

const deleteItem = async (catalogId: string, itemId: string): Promise<void> => {
  const itemResponse = await fetchService(`/v1/catalogs/${catalogId}/items/${itemId}`, {
    method: 'DELETE',
  });

  if (!itemResponse.ok) {
    throw new Error('could not delete item');
  }
}

export const itemService = {
  listItems,
  createItem,
  getItem,
  deleteItem,
};
