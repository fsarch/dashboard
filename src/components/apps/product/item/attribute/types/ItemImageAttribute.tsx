'use client';

import React from 'react';
import { AttributeDto, ImageAttributeDto } from "@/services/product/attribute.type";
import { ItemImageAttributeDto } from "@/services/product/item-attribute.type";
import Input from "@/components/universals/forms/Input";
import { ImageInput } from "@/components/universals/forms/ImageInput";
import TileList from "@/components/universals/tile-list/TileList";
import { ImageListInput } from "@/components/universals/forms/ImageListInput";

type ItemImageAttributeProps = {
  attribute: ImageAttributeDto;
  value?: ItemImageAttributeDto;
  catalogId: string;
};

export const ItemImageAttribute: React.FunctionComponent<ItemImageAttributeProps> = ({
  attribute,
  value,
  catalogId,
}) => {
  return (
    <TileList
      orientation="left"
    >
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
