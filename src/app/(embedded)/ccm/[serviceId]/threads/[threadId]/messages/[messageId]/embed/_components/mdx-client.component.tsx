'use client';

import { MDXRemote, type MDXRemoteSerializeResult } from 'next-mdx-remote';
import type React from 'react';
import { useEffect } from 'react';

type MdxClientProps = {
  content: MDXRemoteSerializeResult;
};

const MdxClient: React.FunctionComponent<MdxClientProps> = ({ content }) => {
  return <MDXRemote {...content} />;
};

export default MdxClient;
