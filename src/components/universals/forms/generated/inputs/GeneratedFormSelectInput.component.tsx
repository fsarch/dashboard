import React, { useId } from 'react';
import {
  TGeneratedFormSelectInput,
} from "@/components/universals/forms/generated/GeneratedForm.type";
import { Field } from "formik";
import FieldsetRow from "@/components/universals/forms/FieldsetRow.component";
import styles from './GeneratedFormSelectInput.module.scss';

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
      <Field className={styles.input} id={id} name={input.id} as="select">
        {(input.data.value ?? []).map((value) => (
          <option key={value.id} value={value.value}>{value.label}</option>
        ))}
      </Field>
    </FieldsetRow>
  );
};

export default GeneratedFormSelectInput;
