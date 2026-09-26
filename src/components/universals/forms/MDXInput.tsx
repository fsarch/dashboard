'use client';

import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CreateLink,
  headingsPlugin,
  ListsToggle,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  MDXEditor,
  toolbarPlugin,
  UndoRedo,
} from '@mdxeditor/editor';
import { useField } from 'formik';
import type React from 'react';
import { useCallback } from 'react';

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

  const handleChange = useCallback(
    async (markdown: string) => {
      await helpers.setValue(markdown);
    },
    [helpers],
  );

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
              <BlockTypeSelect />
              <BoldItalicUnderlineToggles />
              <CreateLink />
              <ListsToggle />
              <UndoRedo />
            </>
          ),
        }),
      ]}
      className={className}
      markdown={field.value}
      onChange={handleChange}
      onBlur={field.onBlur}
    />
  );
};

export default MdxInput;
