'use client';

import React, { useCallback } from 'react';
import { BindableValue } from '@/services/image-editor-server/image-editor-server.type';
import { TFlattenedParameterPath } from './parameter-paths.utils';
import FieldsetRow from '@/components/universals/forms/FieldsetRow.component';
import SegmentedControl from '@/components/universals/forms/SegmentedControl';
import colorInputStyles from '@/components/universals/forms/generated/inputs/GeneratedFormColorInput.module.scss';
import formControls from './FormControls.module.scss';
import styles from './LayerCanvasEditor.module.scss';

type TBindableFieldKind = 'text' | 'number' | 'color' | 'textarea' | 'select';

type BindableFieldProps = {
  label: string;
  kind: TBindableFieldKind;
  value: BindableValue<string | number> | undefined;
  onChange: (next: BindableValue<string | number>) => void;
  selectOptions?: Array<{ value: string; label: string }>;
  // Only parameters whose type matches this field's expected value type
  // make sense to bind against (e.g. a color field binds to a "text"
  // parameter, never a "number" one).
  compatibleParameters: TFlattenedParameterPath[];
};

// A single option of the layer's transformationMatrix/options tree, editable
// as EITHER a hard-coded constant OR a reference to one of the version's
// Parameters - directly mirrors the backend's BindableValue<T> union
// (see rendering/bindable-value.ts) rather than hiding it behind a
// generic auto-form, which is exactly why this page doesn't use
// GeneratedForm.
const BindableField: React.FunctionComponent<BindableFieldProps> = ({
  label,
  kind,
  value,
  onChange,
  selectOptions,
  compatibleParameters,
}) => {
  const isVariable = value?.type === 'variable';

  const handleModeChange = useCallback((mode: 'constant' | 'variable') => {
    if (mode === 'variable') {
      onChange({ type: 'variable', value: compatibleParameters[0]?.path ?? '' });
    } else {
      onChange({ type: 'constant', value: kind === 'number' ? 0 : '' });
    }
  }, [onChange, compatibleParameters, kind]);

  const handleConstantChange = useCallback((raw: string) => {
    onChange({ type: 'constant', value: kind === 'number' ? Number(raw) : raw });
  }, [onChange, kind]);

  const handleVariableChange = useCallback((path: string) => {
    onChange({ type: 'variable', value: path });
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
          <select className={formControls.selectInput} value={value?.value as string ?? ''} onChange={(e) => handleVariableChange(e.target.value)}>
            {compatibleParameters.map((parameter) => (
              <option key={parameter.path} value={parameter.path}>{parameter.label}</option>
            ))}
          </select>
        ) : (
          <ConstantInput kind={kind} value={value?.value} onChange={handleConstantChange} selectOptions={selectOptions} />
        )}
      </div>
    </FieldsetRow>
  );
};

const ConstantInput: React.FunctionComponent<{
  kind: TBindableFieldKind;
  value: string | number | undefined;
  onChange: (raw: string) => void;
  selectOptions?: Array<{ value: string; label: string }>;
}> = ({ kind, value, onChange, selectOptions }) => {
  if (kind === 'select') {
    return (
      <SegmentedControl
        value={value as string ?? selectOptions?.[0]?.value ?? ''}
        onChange={onChange}
        options={selectOptions ?? []}
      />
    );
  }

  if (kind === 'textarea') {
    return (
      <textarea
        className={formControls.textareaInput}
        value={value as string ?? ''}
        onChange={(e) => onChange(e.target.value)}
        rows={6}
      />
    );
  }

  if (kind === 'color') {
    return <input className={colorInputStyles.colorInput} type="color" value={(value as string) || '#000000'} onChange={(e) => onChange(e.target.value)} />;
  }

  return (
    <input
      className={formControls.textInput}
      type={kind === 'number' ? 'number' : 'text'}
      value={value as string | number ?? ''}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default BindableField;
