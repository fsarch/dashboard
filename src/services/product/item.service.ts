import { fetchService } from "@/utils/fetchService";
import {
  AttributeDto,
} from "@/services/product/attribute.type";
import { ItemCreateDto, ItemDto } from "@/services/product/item.type";

const listItems = async (catalogId: string): Promise<Array<ItemDto>> => {
  const itemResponse = await fetchService(`/v1/catalogs/${catalogId}/items`);
  const items = await itemResponse.json();

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

export const itemService = {
  listItems,
  createItem,
};
