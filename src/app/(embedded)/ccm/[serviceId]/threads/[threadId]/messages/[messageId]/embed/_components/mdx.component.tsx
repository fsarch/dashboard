import React from 'react';
import { serialize } from "next-mdx-remote/serialize";
import MdxClient
  from "@/app/(embedded)/ccm/[serviceId]/threads/[threadId]/messages/[messageId]/embed/_components/mdx-client.component";

type MdxProps = {
  content: string;
};

const Mdx: React.FunctionComponent<MdxProps> = async ({
  content,
}) => {
  const serializedContent = await serialize(content)

  return (
    <MdxClient content={serializedContent}/>
  );
};

export default Mdx;
