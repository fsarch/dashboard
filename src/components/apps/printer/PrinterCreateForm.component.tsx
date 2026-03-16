import 'server-only';

import GeneratedForm from "@/components/universals/forms/generated/GeneratedForm.component";
import { PRINTER_CREATE_FORM } from "@/services/printer/printer.forms";

export const PrinterCreateForm = async () => {
  return (
    <GeneratedForm
      definition={PRINTER_CREATE_FORM}
    />
  );
};
