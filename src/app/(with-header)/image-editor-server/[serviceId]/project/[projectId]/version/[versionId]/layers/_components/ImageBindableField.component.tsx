'use client';

import React, { useCallback } from 'react';
import { Base64Image, BindableValue } from '@/services/image-editor-server/image-editor-server.type';
import { TFlattenedParameterPath } from './parameter-paths.utils';
import FieldsetRow from '@/components/universals/forms/FieldsetRow.component';
import SegmentedControl from '@/components/universals/forms/SegmentedControl';
import formControls from './FormControls.module.scss';
import styles from './LayerCanvasEditor.module.scss';

type ImageBindableFieldProps = {
  label: string;
  value: BindableValue<Base64Image> | undefined;
  onChange: (next: BindableValue<Base64Image>) => void;
  compatibleParameters: TFlattenedParameterPath[];
};

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // dataUrl looks like "data:image/png;base64,AAAA..." - we only store the payload after the comma.
      const dataUrl = reader.result as string;
      resolve(dataUrl.slice(dataUrl.indexOf(',') + 1));
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

// The `image` option's constant value is a Base64Image ({type:'base64',
// value}), not a plain string/number - so unlike BindableField's generic
// text/number/color inputs, the constant-mode control here is a file
// picker that reads the chosen image into a base64 string.
const ImageBindableField: React.FunctionComponent<ImageBindableFieldProps> = ({
  label,
  value,
  onChange,
  compatibleParameters,
}) => {
  const isVariable = value?.type === 'variable';

  const handleModeChange = useCallback((mode: 'constant' | 'variable') => {
    if (mode === 'variable') {
      onChange({ type: 'variable', value: compatibleParameters[0]?.path ?? '' });
    } else {
      onChange({ type: 'constant', value: { type: 'base64', value: '' } });
    }
  }, [onChange, compatibleParameters]);

  const handleFileChange = useCallback(async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    const base64 = await readFileAsBase64(file);
    onChange({ type: 'constant', value: { type: 'base64', value: base64 } });
  }, [onChange]);

  return (
    <FieldsetRow label={label}>
      <div className={styles.bindableField}>
        <SegmentedControl
          value={isVariable ? 'variable' : 'constant'}
          onChange={handleModeChange}
          options={[
            { value: 'constant', label: 'Konstante' },
            { value: 'variable', label: 'Parameter', disabled: compatibleParameters.length === 0 },
          ]}
        />

        {isVariable ? (
          <select className={formControls.selectInput} value={value?.value as string ?? ''} onChange={(e) => onChange({ type: 'variable', value: e.target.value })}>
            {compatibleParameters.map((parameter) => (
              <option key={parameter.path} value={parameter.path}>{parameter.label}</option>
            ))}
          </select>
        ) : (
          <>
            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e.target.files)} />
            {value?.type === 'constant' && value.value.value && (
              // eslint-disable-next-line @next/next/no-img-element -- base64 preview thumbnail, not an optimizable static asset
              <img src={`data:image/png;base64,${value.value.value}`} alt="Vorschau" style={{ maxHeight: 40, marginLeft: 8 }} />
            )}
          </>
        )}
      </div>
    </FieldsetRow>
  );
};

export default ImageBindableField;
