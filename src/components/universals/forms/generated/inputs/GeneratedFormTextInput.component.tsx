import React, { useId } from 'react';
import Input from "@/components/universals/forms/Input";
import { TGeneratedFormTextInput } from "@/components/universals/forms/generated/GeneratedForm.type";
import FieldsetRow from '@/components/universals/forms/FieldsetRow.component';

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
      <Input
        id={id}
        name={input.id}
        type="text"
      />
    </FieldsetRow>
  );
};

export default GeneratedFormTextInput;
