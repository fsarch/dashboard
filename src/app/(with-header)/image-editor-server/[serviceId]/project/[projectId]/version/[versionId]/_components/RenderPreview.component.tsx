'use client';

import React, { useCallback, useState } from 'react';
import Section from '@/components/universals/section/Section';
import TextArea from '@/components/universals/forms/TextArea';
import Button from '@/components/universals/forms/Button';
import { Form, Formik } from 'formik';
import { renderVersionPreview } from './RenderPreview.server-action';

type RenderPreviewProps = {
  projectId: string;
  versionId: string;
};

type TFormValues = {
  parametersJson: string;
};

// A raw JSON textarea (rather than one input per Parameter) is deliberate
// here: the Parameter tree can be arbitrarily nested (object parameters
// with children), and this is purely a "try it out" tool for admins, not
// the actual authoring surface for a version's content - the layer editor
// covers that with a proper per-field UI.
const RenderPreview: React.FunctionComponent<RenderPreviewProps> = ({ projectId, versionId }) => {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (values: TFormValues) => {
    setDataUrl(null);
    setError(null);

    let parameters: Record<string, unknown>;
    try {
      parameters = JSON.parse(values.parametersJson || '{}');
    } catch {
      setError('Ungültiges JSON');
      return;
    }

    const result = await renderVersionPreview(projectId, versionId, parameters);

    if (!result.ok) {
      setError(`Render fehlgeschlagen (${result.status}): ${result.message}`);
      return;
    }

    setDataUrl(`data:image/png;base64,${result.base64}`);
  }, [projectId, versionId]);

  return (
    <Section name="Vorschau rendern">
      <Formik<TFormValues> initialValues={{ parametersJson: '{}' }} onSubmit={handleSubmit}>
        <Form>
          <p>Test-Parameter als JSON (z.B. <code>{'{ "name": "Jane Doe" }'}</code>):</p>
          <TextArea name="parametersJson" />
          <Button type="submit">Rendern</Button>
        </Form>
      </Formik>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {dataUrl && (
        // eslint-disable-next-line @next/next/no-img-element -- rendered PNG is a data: URL from the backend, not an optimizable static asset
        <img src={dataUrl} alt="Render-Vorschau" style={{ maxWidth: '100%', border: '1px solid #ccc' }} />
      )}
    </Section>
  );
};

export default RenderPreview;
