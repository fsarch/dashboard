import React, { useId } from 'react';
import {
  TGeneratedFormSelectInput,
} from "@/components/universals/forms/generated/GeneratedForm.type";
import FieldsetRow from "@/components/universals/forms/FieldsetRow.component";
import Select from "@/components/universals/forms/Select";

type GeneratedFormSelectInputProps = {
  input: TGeneratedFormSelectInput;
};

const GeneratedFormSelectInput: React.FunctionComponent<GeneratedFormSelectInputProps> = ({
  input,
}) => {
  const id = useId();

  if (input.data.$type !== 'constant') {
    return null;
  }

  return (
    <FieldsetRow
      label={(
        <label
          htmlFor={id}
        >
          {input.label}
        </label>
      )}
    >
      <Select id={id} name={input.id} values={input.data.value ?? []}/>
    </FieldsetRow>
  );
};

export default GeneratedFormSelectInput;
