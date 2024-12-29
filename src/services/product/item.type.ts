import { ItemAttributeDto } from "@/services/product/item-attribute.type";

export type ItemCreateDto = {
  itemTypeId: string;

  parentItemId?: string;

  externalId?: string;
};

export type ItemDto = {
  id: string;

  itemTypeId: string;

  parentItemId?: string;

  externalId?: string;

  name: string;

  attributes?: Array<ItemAttributeDto>;
};
