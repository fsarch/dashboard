'use client';

import React, { useCallback } from 'react';
import Section from '@/components/universals/section/Section';
import FieldsetRow from '@/components/universals/forms/FieldsetRow.component';
import formControls from './FormControls.module.scss';
import { ParameterDto } from '@/services/image-editor-server/image-editor-server.type';
import { colors } from '@/app/_styles/colors';

type TestParametersPanelProps = {
  parameters: ParameterDto[];
  value: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
};

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      resolve(dataUrl.slice(dataUrl.indexOf(',') + 1));
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function setAtPath(root: Record<string, unknown>, segments: string[], value: unknown): Record<string, unknown> {
  if (segments.length === 0) return root;
  const [head, ...rest] = segments;

  if (rest.length === 0) {
    return { ...root, [head]: value };
  }

  const child = (root[head] as Record<string, unknown>) ?? {};
  return { ...root, [head]: setAtPath(child, rest, value) };
}

function getAtPath(root: Record<string, unknown>, segments: string[]): unknown {
  let current: unknown = root;
  for (const segment of segments) {
    if (typeof current !== 'object' || current === null) return undefined;
    current = (current as Record<string, unknown>)[segment];
  }
  return current;
}

// A purely-editor-side test harness: lets an admin enter sample values for
// the version's Parameter schema so LayerCanvasEditor can resolve
// variable-bound fields live (see bindable-value.utils.ts), without leaving
// the page or waiting on a real render. Recurses into "object" parameters.
const TestParametersPanel: React.FunctionComponent<TestParametersPanelProps> = ({ parameters, value, onChange }) => {
  const handleFieldChange = useCallback((path: string[], next: unknown) => {
    onChange(setAtPath(value, path, next));
  }, [value, onChange]);

  return (
    <Section name="Test-Parameter (Live-Vorschau)" color={colors.lightPurple}>
      <ParameterFields parameters={parameters} parentId={null} path={[]} value={value} onFieldChange={handleFieldChange} />
    </Section>
  );
};

const ParameterFields: React.FunctionComponent<{
  parameters: ParameterDto[];
  parentId: string | null;
  path: string[];
  value: Record<string, unknown>;
  onFieldChange: (path: string[], value: unknown) => void;
}> = ({ parameters, parentId, path, value, onFieldChange }) => {
  const children = parameters
    .filter((p) => p.parentId === parentId)
    .sort((a, b) => a.order - b.order);

  return (
    <>
      {children.map((parameter) => {
        const fieldPath = [...path, parameter.name];
        const currentValue = getAtPath(value, fieldPath);

        if (parameter.type === 'object') {
          return (
            <fieldset key={parameter.id} style={{ marginLeft: 16 }}>
              <legend>{parameter.name}</legend>
              <ParameterFields parameters={parameters} parentId={parameter.id} path={fieldPath} value={value} onFieldChange={onFieldChange} />
            </fieldset>
          );
        }

        return (
          <FieldsetRow key={parameter.id} label={`${parameter.name}${parameter.required ? ' *' : ''}`}>
            {parameter.type === 'text' && (
              <input
                className={formControls.textInput}
                type="text"
                value={(currentValue as string) ?? ''}
                onChange={(e) => onFieldChange(fieldPath, e.target.value)}
              />
            )}
            {parameter.type === 'number' && (
              <input
                className={formControls.textInput}
                type="number"
                value={(currentValue as number) ?? ''}
                onChange={(e) => onFieldChange(fieldPath, e.target.value === '' ? undefined : Number(e.target.value))}
              />
            )}
            {parameter.type === 'image' && (
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const base64 = await readFileAsBase64(file);
                  onFieldChange(fieldPath, { type: 'base64', value: base64 });
                }}
              />
            )}
          </FieldsetRow>
        );
      })}
    </>
  );
};

export default TestParametersPanel;
