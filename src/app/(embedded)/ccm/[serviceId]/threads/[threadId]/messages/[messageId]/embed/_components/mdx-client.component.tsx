'use client';

import React, { useEffect } from 'react';
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";

type MdxClientProps = {
  content: MDXRemoteSerializeResult;
};

const MdxClient: React.FunctionComponent<MdxClientProps> = ({
  content,
}) => {
  useEffect(() => {
    const body = document.body,
      html = document.documentElement;

    const height = Math.max( body.scrollHeight, body.offsetHeight,
      html.clientHeight, html.scrollHeight, html.offsetHeight );

    window.parent.postMessage({
      type: 'resize',
      payload: height,
    }, '*');
  }, []);

  return (
    <MDXRemote {...content} />
  );
};

export default MdxClient;
