'use client';

import React, { useCallback, useState } from 'react';
import Section from '@/components/universals/section/Section';
import Button from '@/components/universals/forms/Button';
import { LayerDto, LayerType } from '@/services/image-editor-server/image-editor-server.type';
import { createLayerAction } from './LayerCanvasEditor.server-action';

type AddLayerFormProps = {
  projectId: string;
  versionId: string;
  nextOrder: number;
  onCreated: (layer: LayerDto) => void;
};

const LAYER_TYPES: Array<{ value: LayerType; label: string }> = [
  { value: 'text', label: 'Text' },
  { value: 'image', label: 'Bild' },
  { value: 'shape', label: 'Form' },
  { value: 'html', label: 'HTML' },
];

const AddLayerForm: React.FunctionComponent<AddLayerFormProps> = ({ projectId, versionId, nextOrder, onCreated }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<LayerType>('text');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      const layer = await createLayerAction(projectId, versionId, { name, type, order: nextOrder });
      onCreated(layer);
      setName('');
    } finally {
      setIsSubmitting(false);
    }
  }, [projectId, versionId, name, type, nextOrder, onCreated]);

  return (
    <Section name="Ebene hinzufügen">
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <select value={type} onChange={(e) => setType(e.target.value as LayerType)}>
          {LAYER_TYPES.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <Button type="submit" disabled={isSubmitting || !name.trim()}>
          {isSubmitting ? 'Erstelle...' : 'Hinzufügen'}
        </Button>
      </form>
    </Section>
  );
};

export default AddLayerForm;
