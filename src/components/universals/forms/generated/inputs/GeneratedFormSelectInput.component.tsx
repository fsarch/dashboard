import React from 'react';
import Input from "@/components/universals/forms/Input";
import {
  TGeneratedFormSelectInput,
  TGeneratedFormTextInput
} from "@/components/universals/forms/generated/GeneratedForm.type";
import { Field } from "formik";

type GeneratedFormSelectInputProps = {
  input: TGeneratedFormSelectInput;
};

const GeneratedFormSelectInput: React.FunctionComponent<GeneratedFormSelectInputProps> = ({
  input,
}) => {
  if (input.data.$type !== 'constant') {
    return null;
  }

  return (
    <label
      key={input.id}
    >
      {input.label}
      <Field name={input.id} as="select">
        {(input.data.value ?? []).map((value) => (
          <option key={value.id} value={value.value}>{value.label}</option>
        ))}
      </Field>
    </label>
  );
};

export default GeneratedFormSelectInput;
