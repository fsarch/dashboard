'use client';

import type React from 'react';
import { ImageInput } from '@/components/universals/forms/ImageInput';
import { ImageListInput } from '@/components/universals/forms/ImageListInput';
import Input from '@/components/universals/forms/Input';
import TileList from '@/components/universals/tile-list/TileList';
import {
  AttributeDto,
  type ImageAttributeDto,
} from '@/services/product/attribute.type';
import type { ItemImageAttributeDto } from '@/services/product/item-attribute.type';

type ItemImageAttributeProps = {
  attribute: ImageAttributeDto;
  value?: ItemImageAttributeDto;
  catalogId: string;
};

export const ItemImageAttribute: React.FunctionComponent<
  ItemImageAttributeProps
> = ({ attribute, value, catalogId }) => {
  return (
    <TileList orientation="left">
      {value?.value?.map((value, index) => (
        <ImageListInput
          key={index}
          name={`attributes['${attribute.id}'].value[${index}]`}
          imageServerUrl={attribute.imageServerUrl}
        />
      ))}
      <ImageListInput
        name={`attributes['${attribute.id}'].value[${value?.value?.length ?? 0}]`}
        imageServerUrl={attribute.imageServerUrl}
      />
    </TileList>
  );
};
