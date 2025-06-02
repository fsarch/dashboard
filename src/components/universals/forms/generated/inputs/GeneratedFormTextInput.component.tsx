import React, { useId } from 'react';
import Input from "@/components/universals/forms/Input";
import { TGeneratedFormTextInput } from "@/components/universals/forms/generated/GeneratedForm.type";
import FieldsetRow from '@/components/universals/forms/FieldsetRow.component';
import QrInput from "@/components/universals/forms/QrInput";

type GeneratedFormTextInputProps = {
  input: TGeneratedFormTextInput;
};

const GeneratedFormTextInput: React.FunctionComponent<GeneratedFormTextInputProps> = ({
  input,
}) => {
  const id = useId();

  return (
    <FieldsetRow
      label={(
        <label htmlFor={id}>{input.label}</label>
      )}
    >
      {input.buttons && input.buttons[0].type === 'qr-scanner' ? (
        <QrInput
          id={id}
          name={input.id}
        />
      ) : (
        <Input
          id={id}
          name={input.id}
          type="text"
        />
      )}
    </FieldsetRow>
  );
};

export default GeneratedFormTextInput;
