import { customerCommunicationService } from "@/services/customer-communication/customer-communication.service";
import { renderToString } from "react-dom/server";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import MdxClient
  from "@/app/(embedded)/ccm/[serviceId]/threads/[threadId]/messages/[messageId]/embed/_components/mdx-client.component";
import Mdx
  from "@/app/(embedded)/ccm/[serviceId]/threads/[threadId]/messages/[messageId]/embed/_components/mdx.component";
import { EContentType } from "@/constants/apps/customer-communication/content-type.enum";
import Html
  from "@/app/(embedded)/ccm/[serviceId]/threads/[threadId]/messages/[messageId]/embed/_components/html.component";

export default async function Home({ params }: { params: { threadId: string; messageId: string } }) {
  const threadMessages = await customerCommunicationService.listThreadMessages(params.threadId);

  const message = threadMessages.find((m) => m.id === params.messageId);

  if (message?.contentType?.id === EContentType.TEXT_MARKDOWN) {
    return (
      <Mdx content={message?.content ?? ''}/>
    );
  }

  if (message?.contentType?.id === EContentType.TEXT_HTML) {
    return (
      <Html content={message.content}/>
    );
  }

  return (
    <div>
      unknown type
    </div>
  );
}
