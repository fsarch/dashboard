import { useField } from 'formik';
import type React from 'react';
import { useCallback } from 'react';

type MarkdownHintProps = {
  name: string;
  value: string | number;
};

const MarkdownHint: React.FunctionComponent<MarkdownHintProps> = ({
  name,
  value,
}) => {
  const [props, meta, helpers] = useField({
    name,
  });

  const handleClick = useCallback(async () => {
    await helpers.setValue(value);
  }, [helpers, value]);

  if (props.value === value) {
    return null;
  }

  return (
    <button type="button" onClick={handleClick}>
      Markdown aktivieren
    </button>
  );
};

export default MarkdownHint;
