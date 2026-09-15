'use client';

import React, { useCallback } from 'react';
import Section from '@/components/universals/section/Section';
import Button from '@/components/universals/forms/Button';
import {
  BindableValue,
  HtmlLayerOptions,
  ImageLayerOptions,
  LayerDto,
  LayerOptions,
  ShapeLayerOptions,
  TextLayerOptions,
} from '@/services/image-editor-server/image-editor-server.type';
import { TFlattenedParameterPath } from './parameter-paths.utils';
import BindableField from './BindableField.component';
import ImageBindableField from './ImageBindableField.component';
import { colors } from '@/app/_styles/colors';

type LayerPropertiesPanelProps = {
  layer: LayerDto;
  parameterPaths: TFlattenedParameterPath[];
  onChangeName: (name: string) => void;
  onChangeOptions: (options: LayerOptions) => void;
  onDelete: () => void;
};

const LayerPropertiesPanel: React.FunctionComponent<LayerPropertiesPanelProps> = ({
  layer,
  parameterPaths,
  onChangeName,
  onChangeOptions,
  onDelete,
}) => {
  const textParams = parameterPaths.filter((p) => p.type === 'text');
  const numberParams = parameterPaths.filter((p) => p.type === 'number');
  const imageParams = parameterPaths.filter((p) => p.type === 'image');

  const setField = useCallback(<K extends string>(key: K, value: BindableValue<unknown>) => {
    onChangeOptions({ ...layer.options, [key]: value } as LayerOptions);
  }, [layer.options, onChangeOptions]);

  return (
    <Section name={`Ebene: ${layer.name}`} color={colors.lightBlue}>
      <label>
        Name{' '}
        <input type="text" value={layer.name} onChange={(e) => onChangeName(e.target.value)} />
      </label>

      {layer.type === 'text' && (
        <>
          <BindableField label="Inhalt" kind="text" value={(layer.options as TextLayerOptions).content} onChange={(v) => setField('content', v)} compatibleParameters={textParams} />
          <BindableField label="Schriftart" kind="text" value={(layer.options as TextLayerOptions).fontFamily} onChange={(v) => setField('fontFamily', v)} compatibleParameters={textParams} />
          <BindableField label="Schriftgröße" kind="number" value={(layer.options as TextLayerOptions).fontSize} onChange={(v) => setField('fontSize', v)} compatibleParameters={numberParams} />
          <BindableField label="Farbe" kind="color" value={(layer.options as TextLayerOptions).color} onChange={(v) => setField('color', v)} compatibleParameters={textParams} />
        </>
      )}

      {layer.type === 'shape' && (
        <>
          <BindableField
            label="Form"
            kind="select"
            selectOptions={[{ value: 'rectangle', label: 'Rechteck' }, { value: 'ellipse', label: 'Ellipse' }]}
            value={(layer.options as ShapeLayerOptions).shape}
            onChange={(v) => setField('shape', v)}
            compatibleParameters={textParams}
          />
          <BindableField label="Breite" kind="number" value={(layer.options as ShapeLayerOptions).width} onChange={(v) => setField('width', v)} compatibleParameters={numberParams} />
          <BindableField label="Höhe" kind="number" value={(layer.options as ShapeLayerOptions).height} onChange={(v) => setField('height', v)} compatibleParameters={numberParams} />
          <BindableField label="Füllfarbe" kind="color" value={(layer.options as ShapeLayerOptions).fillColor} onChange={(v) => setField('fillColor', v)} compatibleParameters={textParams} />
          <BindableField label="Rahmenfarbe" kind="color" value={(layer.options as ShapeLayerOptions).strokeColor} onChange={(v) => setField('strokeColor', v)} compatibleParameters={textParams} />
          <BindableField label="Rahmenbreite" kind="number" value={(layer.options as ShapeLayerOptions).strokeWidth} onChange={(v) => setField('strokeWidth', v)} compatibleParameters={numberParams} />
        </>
      )}

      {layer.type === 'image' && (
        <>
          <ImageBindableField label="Bild" value={(layer.options as ImageLayerOptions).image} onChange={(v) => setField('image', v)} compatibleParameters={imageParams} />
          <BindableField label="Breite" kind="number" value={(layer.options as ImageLayerOptions).width} onChange={(v) => setField('width', v)} compatibleParameters={numberParams} />
          <BindableField label="Höhe" kind="number" value={(layer.options as ImageLayerOptions).height} onChange={(v) => setField('height', v)} compatibleParameters={numberParams} />
        </>
      )}

      {layer.type === 'html' && (
        <>
          <BindableField label="HTML" kind="textarea" value={(layer.options as HtmlLayerOptions).html} onChange={(v) => setField('html', v)} compatibleParameters={textParams} />
          <BindableField label="Breite" kind="number" value={(layer.options as HtmlLayerOptions).width} onChange={(v) => setField('width', v)} compatibleParameters={numberParams} />
          <BindableField label="Höhe" kind="number" value={(layer.options as HtmlLayerOptions).height} onChange={(v) => setField('height', v)} compatibleParameters={numberParams} />
        </>
      )}

      <Button type="button" color={colors.lightRed} onClick={onDelete}>
        Ebene löschen
      </Button>
    </Section>
  );
};

export default LayerPropertiesPanel;
