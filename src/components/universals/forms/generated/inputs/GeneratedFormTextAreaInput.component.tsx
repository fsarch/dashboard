import React, { useId } from 'react';
import { Field } from "formik";
import { TGeneratedFormTextAreaInput } from "@/components/universals/forms/generated/GeneratedForm.type";
import FieldsetRow from '@/components/universals/forms/FieldsetRow.component';
import { nestedFormUtils } from "@/components/universals/forms/generated/inputs/nested/nested-form.utils";
import styles from './GeneratedFormTextAreaInput.module.scss';

type GeneratedFormTextAreaInputProps = {
  input: TGeneratedFormTextAreaInput;
};

const GeneratedFormTextAreaInput: React.FunctionComponent<GeneratedFormTextAreaInputProps> = ({
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
      <Field
        id={id}
        name={name}
        as="textarea"
        className={styles.textarea}
        disabled={input.isEnabled === false}
      />
    </FieldsetRow>
  );
};

export default GeneratedFormTextAreaInput;

