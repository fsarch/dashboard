export type ItemTypeDto = {
  id: string;

  name: string;
};

export type ItemTypeCreateDto = {
  name: string;
};

export type AttributeItemTypeCreateDto = {
  isRequired: boolean;
}

export type AttributeItemTypeDto = {
  id: string;

  attributeId: string;

  itemTypeId: string;

  isRequired: boolean;
}
