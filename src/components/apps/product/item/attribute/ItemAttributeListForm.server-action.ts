'use server';

import { imagesAdminService } from '@/services/image/images-admin.service';
import { AttributeType } from '@/services/product/attribute.const';
import type { ImageAttributeDto } from '@/services/product/attribute.type';
import { itemService } from '@/services/product/item.service';
import { itemAttributeService } from '@/services/product/item-attribute.service';
import type { ItemAttributeDto } from '@/services/product/item-attribute.type';
import { itemTypeService } from '@/services/product/item-type.service';
import { ServerLogger } from '@/utils/ServerLogger';

export type ItemAttributeListFormDataType = {
  attributes: Record<string, ItemAttributeDto>;
};

export async function setItemAttributes(
  catalogId: string,
  itemId: string,
  formData: ItemAttributeListFormDataType,
) {
  const item = await itemService.getItem(catalogId, itemId);
  const attributes = await itemTypeService.listAttributes(
    catalogId,
    item.itemTypeId,
    {
      embed: ['attribute'],
    },
  );

  const results: Array<{ status: number; data: unknown }> = [];

  for (const attribute of attributes) {
    if (!(attribute.attributeId in formData.attributes)) {
      continue;
    }

    try {
      const value = formData.attributes[attribute.attributeId];
      if (attribute.attribute?.attributeTypeId === AttributeType.LIST) {
        value.value = (value.value as unknown as Array<string>).map((id) => ({
          id,
        })) as any;
      }

      if (attribute.attribute?.attributeTypeId === AttributeType.IMAGE) {
        console.log('value1^24', value.value);
        if (Array.isArray(value.value)) {
          value.value = (await Promise.all(
            value.value.map(async (value) => {
              try {
                if (!(value as any).$blob) {
                  return value;
                }

                const rawData = (value as any).$blob as File;
                console.log(attribute);
                const imageServerUrl = (
                  attribute.attribute as ImageAttributeDto
                ).imageServerUrl;

                ServerLogger.Instance.log(
                  '[ImageServer] upload image while setting attribute',
                  {
                    serverUrl: imageServerUrl,
                  },
                );

                const imageResponse = await imagesAdminService.uploadImageByUrl(
                  {
                    imageServerUrl,
                    data: Buffer.from(await rawData.arrayBuffer()),
                  },
                );

                ServerLogger.Instance.log(
                  '[ImageServer] uploaded image while setting attribute',
                  {
                    serverUrl: imageServerUrl,
                    response: imageResponse,
                  },
                );

                return {
                  imageId: imageResponse.id,
                };
              } catch (error) {
                ServerLogger.Instance.error(
                  '[ImageServer] failed to upload image while setting attribute',
                  {
                    serverUrl: (attribute.attribute as ImageAttributeDto)
                      .imageServerUrl,
                    error,
                  },
                );
                throw error;
              }
            }),
          )) as any;
        }
        console.log('value1^245', value.value);
      }

      console.log('test124', catalogId, itemId, attribute.attributeId, value);

      const res = await itemAttributeService.setItemAttribute(
        catalogId,
        itemId,
        attribute.attributeId,
        value,
      );
      results.push({
        status: 201,
        data: res,
      });
    } catch (error) {
      results.push({
        status: 500,
        data: error,
      });
    }
  }

  return results;
}
