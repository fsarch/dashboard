'use client';

import React from 'react';
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
  const [field, meta] = useField({
    name,
  });

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
      onChange={field.onChange}
      onBlur={field.onBlur}
    />
  );
};

export default MdxInput;
