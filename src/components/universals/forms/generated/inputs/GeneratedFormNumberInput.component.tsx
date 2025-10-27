import React, { useId } from 'react';
import Input from "@/components/universals/forms/Input";
import {
  TGeneratedFormNumberInput,
} from "@/components/universals/forms/generated/GeneratedForm.type";
import FieldsetRow from '@/components/universals/forms/FieldsetRow.component';
import { nestedFormUtils } from "@/components/universals/forms/generated/inputs/nested/nested-form.utils";

type GeneratedFormNumberInputProps = {
  input: TGeneratedFormNumberInput;
};

const GeneratedFormNumberInput: React.FunctionComponent<GeneratedFormNumberInputProps> = ({
  input,
}) => {
  const id = useId();
  const name = nestedFormUtils.useInputName(input.id);

  return (
    <FieldsetRow
      label={(
        <label htmlFor={id}>{input.label}</label>
      )}
    >
      <Input
        id={id}
        name={name}
        type="number"
        disabled={input.isEnabled === false}
      />
    </FieldsetRow>
  );
};

export default GeneratedFormNumberInput;
