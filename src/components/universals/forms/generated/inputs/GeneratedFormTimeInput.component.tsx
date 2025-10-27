import React, { useId } from 'react';
import Input from "@/components/universals/forms/Input";
import {
  TGeneratedFormTimeInput
} from "@/components/universals/forms/generated/GeneratedForm.type";
import FieldsetRow from '@/components/universals/forms/FieldsetRow.component';
import { nestedFormUtils } from "@/components/universals/forms/generated/inputs/nested/nested-form.utils";

type GeneratedFormTimeInputProps = {
  input: TGeneratedFormTimeInput;
};

const GeneratedFormTimeInput: React.FunctionComponent<GeneratedFormTimeInputProps> = ({
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
        type="time"
        disabled={input.isEnabled === false}
        step={1}
      />
    </FieldsetRow>
  );
};

export default GeneratedFormTimeInput;
