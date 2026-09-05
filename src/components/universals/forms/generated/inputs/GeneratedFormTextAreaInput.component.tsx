import React, { useId } from 'react';
import { useField } from "formik";
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
  // initialValues can come back from the API as `null` (an unset optional
  // field) rather than `''`; Formik passes that straight through, and React
  // warns about a `null` `value` on a controlled <textarea>. Coalesce here
  // instead of relying on every form definition to do it in its jsonata.
  const [field] = useField<string | null | undefined>(name);

  return (
    <FieldsetRow
      label={(
        <label htmlFor={id}>{input.label}</label>
      )}
    >
      <textarea
        {...field}
        id={id}
        value={field.value ?? ''}
        className={styles.textarea}
        disabled={input.isEnabled === false}
      />
    </FieldsetRow>
  );
};

export default GeneratedFormTextAreaInput;

