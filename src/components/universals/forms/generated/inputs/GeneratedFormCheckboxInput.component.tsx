import React, { useId } from 'react';
import FieldsetRow from '@/components/universals/forms/FieldsetRow.component';
import { TGeneratedFormCheckboxInput } from '@/components/universals/forms/generated/GeneratedForm.type';
import { nestedFormUtils } from '@/components/universals/forms/generated/inputs/nested/nested-form.utils';
import { Field } from "formik";

type Props = {
  input: TGeneratedFormCheckboxInput;
};

const GeneratedFormCheckboxInput: React.FunctionComponent<Props> = ({ input }) => {
  const id = useId();
  const name = nestedFormUtils.useInputName(input.id);

  return (
    <FieldsetRow
      label={(
        <label htmlFor={id}>{input.label}</label>
      )}
    >
      <Field
        id={id}
        name={name}
        type="checkbox"
        disabled={input.isEnabled === false}
      />
    </FieldsetRow>
  );
};

export default GeneratedFormCheckboxInput;

