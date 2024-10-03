import { customerCommunicationService } from "@/services/customer-communication/customer-communication.service";
import { renderToString } from "react-dom/server";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import MdxClient
  from "@/app/(embedded)/ccm/[serviceId]/threads/[threadId]/messages/[messageId]/embed/_components/mdx-client.component";

export default async function Home({ params }: { params: { threadId: string; messageId: string } }) {
  const threadMessages = await customerCommunicationService.listThreadMessages(params.threadId);

  const message = threadMessages.find((m) => m.id === params.messageId);

  const content = await serialize(message?.content ?? '')

  return (
    <MdxClient content={content}/>
  );
}
