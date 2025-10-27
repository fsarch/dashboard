import React, { useId } from 'react';
import Input from "@/components/universals/forms/Input";
import { TGeneratedFormTextInput } from "@/components/universals/forms/generated/GeneratedForm.type";
import FieldsetRow from '@/components/universals/forms/FieldsetRow.component';
import QrInput from "@/components/universals/forms/QrInput";
import { nestedFormUtils } from "@/components/universals/forms/generated/inputs/nested/nested-form.utils";

type GeneratedFormTextInputProps = {
  input: TGeneratedFormTextInput;
};

const GeneratedFormTextInput: React.FunctionComponent<GeneratedFormTextInputProps> = ({
  input,
}) => {
  const id = useId();
  const name = nestedFormUtils.useInputName(input.id);

  console.log('name', name);

  return (
    <FieldsetRow
      label={(
        <label htmlFor={id}>{input.label}</label>
      )}
    >
      {input.buttons && input.buttons[0].$type === 'qr-scanner' ? (
        <QrInput
          id={id}
          name={name}
        />
      ) : (
        <Input
          id={id}
          name={name}
          type="text"
          disabled={input.isEnabled === false}
        />
      )}
    </FieldsetRow>
  );
};

export default GeneratedFormTextInput;
