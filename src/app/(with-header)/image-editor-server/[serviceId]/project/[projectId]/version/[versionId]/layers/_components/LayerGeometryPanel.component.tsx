'use client';

import React, { useCallback } from 'react';
import Section from '@/components/universals/section/Section';
import FieldsetRow from '@/components/universals/forms/FieldsetRow.component';
import formControls from './FormControls.module.scss';
import { TLayerGeometry } from './matrix.utils';
import { colors } from '@/app/_styles/colors';

type LayerGeometryPanelProps = {
  geometry: TLayerGeometry;
  hasSize: boolean;
  onChange: (next: TLayerGeometry) => void;
};

// Direct numeric entry for position/rotation/size, as an alternative to
// dragging/resizing/rotating on the canvas - same underlying geometry model
// (see matrix.utils.ts), so typing a value here and dragging the layer
// afterwards stay fully consistent with each other.
const LayerGeometryPanel: React.FunctionComponent<LayerGeometryPanelProps> = ({ geometry, hasSize, onChange }) => {
  const handleFieldChange = useCallback((field: keyof TLayerGeometry, raw: string) => {
    const value = raw === '' ? 0 : Number(raw);
    if (Number.isNaN(value)) return;
    onChange({ ...geometry, [field]: value });
  }, [geometry, onChange]);

  return (
    <Section name="Position, Größe & Rotation" color={colors.lightPurple}>
      <FieldsetRow label="X">
        <input className={formControls.textInput} type="number" value={Math.round(geometry.x)} onChange={(e) => handleFieldChange('x', e.target.value)} />
      </FieldsetRow>
      <FieldsetRow label="Y">
        <input className={formControls.textInput} type="number" value={Math.round(geometry.y)} onChange={(e) => handleFieldChange('y', e.target.value)} />
      </FieldsetRow>
      <FieldsetRow label="Rotation (°)">
        <input className={formControls.textInput} type="number" value={Math.round(geometry.rotationDeg)} onChange={(e) => handleFieldChange('rotationDeg', e.target.value)} />
      </FieldsetRow>
      {hasSize && (
        <>
          <FieldsetRow label="Breite">
            <input className={formControls.textInput} type="number" min={1} value={Math.round(geometry.width)} onChange={(e) => handleFieldChange('width', e.target.value)} />
          </FieldsetRow>
          <FieldsetRow label="Höhe">
            <input className={formControls.textInput} type="number" min={1} value={Math.round(geometry.height)} onChange={(e) => handleFieldChange('height', e.target.value)} />
          </FieldsetRow>
        </>
      )}
    </Section>
  );
};

export default LayerGeometryPanel;
