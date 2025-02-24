import React from 'react';
import Input from "@/components/universals/forms/Input";
import { TGeneratedFormTextInput } from "@/components/universals/forms/generated/GeneratedForm.type";

type GeneratedFormTextInputProps = {
  input: TGeneratedFormTextInput;
};

const GeneratedFormTextInput: React.FunctionComponent<GeneratedFormTextInputProps> = ({
  input,
}) => {
  return (
    <label
      key={input.id}
    >
      {input.label}
      <Input
        name={input.id}
        type="text"
      />
    </label>
  );
};

export default GeneratedFormTextInput;
