'use client';

import React, { useEffect } from 'react';
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";

type MdxClientProps = {
  content: MDXRemoteSerializeResult;
};

const MdxClient: React.FunctionComponent<MdxClientProps> = ({
  content,
}) => {
  return (
    <MDXRemote {...content} />
  );
};

export default MdxClient;
