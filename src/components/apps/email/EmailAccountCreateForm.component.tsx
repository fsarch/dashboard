import 'server-only';

import GeneratedForm from "@/components/universals/forms/generated/GeneratedForm.component";
import { EMAIL_ACCOUNT_CREATE_FORM } from "@/services/email/email.forms";

export const EmailAccountCreateForm = async () => {
  return (
    <GeneratedForm
      definition={EMAIL_ACCOUNT_CREATE_FORM}
    />
  );
};

