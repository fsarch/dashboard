'use client';

import React from 'react';
import { useField } from "formik";
import { ImageInput } from "@/components/universals/forms/ImageInput";
import TileListItem from "@/components/universals/tile-list/TileListItem";
import styles from './ImageListInput.module.scss';

type ImageInputProps = {
  name: string;
  disabled?: boolean;
  required?: boolean;
  multiple?: boolean;
  capture?: 'user' | 'environment';
  imageServerUrl: string;
};

export const ImageListInput: React.FunctionComponent<ImageInputProps> = ({
  name,
  disabled,
  required,
  multiple,
  capture,
  imageServerUrl,
}) => {
  const [field, meta, helpers] = useField(name);

  const hasValue = !!(field.value?.imageUrl || field.value?.$blob);
  console.log('field', hasValue);

  return (
    <div className={styles.root}>
      <TileListItem
        name={hasValue ? '' : 'Upload Image'}
        backgroundImage={field.value?.imageUrl}
        icon={hasValue ? undefined : 'upload'}
      >

      </TileListItem>
      <ImageInput
        className={styles.input}
        name={`${name}.$blob`}
        disabled={disabled}
        required={required}
        multiple={multiple}
        capture={capture}
        imageServerUrl={imageServerUrl}
      />
    </div>
  );
};
