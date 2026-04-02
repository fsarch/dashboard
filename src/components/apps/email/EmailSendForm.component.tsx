import 'server-only';

import GeneratedForm from "@/components/universals/forms/generated/GeneratedForm.component";
import { EMAIL_SEND_FORM } from "@/services/email/email.forms";

type EmailSendFormProps = {
  accountId: string;
};

export const EmailSendForm = async ({ accountId }: EmailSendFormProps) => {
  return (
    <GeneratedForm
      definition={EMAIL_SEND_FORM}
      args={{ accountId }}
    />
  );
};

