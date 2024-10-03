'use client';

import React, { useCallback } from 'react';
import { useField } from "formik";
import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CreateLink, headingsPlugin, linkDialogPlugin, linkPlugin, listsPlugin, ListsToggle,
  MDXEditor,
  toolbarPlugin,
  UndoRedo
} from '@mdxeditor/editor';

type MdxInputProps = {
  name: string;
  className?: string;
};

const MdxInput: React.FunctionComponent<MdxInputProps> = ({
  name,
  className,
}) => {
  const [field, meta, helpers] = useField({
    name,
  });

  const handleChange = useCallback(async (markdown: string) => {
    await helpers.setValue(markdown);
  }, [helpers]);

  return (
    <MDXEditor
      plugins={[
        headingsPlugin(),
        linkDialogPlugin(),
        listsPlugin(),
        linkPlugin(),
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <BlockTypeSelect/>
              <BoldItalicUnderlineToggles />
              <CreateLink/>
              <ListsToggle/>
              <UndoRedo />
            </>
          )
        })
      ]}
      className={className}
      markdown={field.value}
      onChange={handleChange}
      onBlur={field.onBlur}
    />
  );
};

export default MdxInput;
