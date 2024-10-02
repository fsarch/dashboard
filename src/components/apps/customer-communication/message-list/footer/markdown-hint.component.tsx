import React, { useCallback } from 'react';
import { useField } from "formik";

type MarkdownHintProps = {
  name: string;
  value: string;
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
    <button
      type="button"
      onClick={handleClick}
    >
      Markdown aktivieren
    </button>
  );
};

export default MarkdownHint;
